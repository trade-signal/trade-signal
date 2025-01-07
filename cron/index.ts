import "dotenv/config";

import { CronJob } from "cron";
import dayjs from "dayjs";
import { getRunDate } from "@/shared/date";
import {
  cleanStockSelection,
  initStockSelectionData,
  seedStockSelection
} from "./stock/stock_selection";
import { cleanNews, initNewsData, seedNews } from "./news";
import {
  cleanStockQuotes,
  initStockQuotesData,
  seedStockQuotes
} from "./stock/stock_quotes";
import { seedDailyStockQuotes } from "./stock/stock_quotes_daily";
import { initStockBaseData, seedStockBase } from "./stock/stock_base";
import { isTradeDate, refreshTradeDates } from "./stock/trade_date";
import { initStockIndexData, seedIndex } from "./stock/stock_index";

const print = (message: string) => {
  console.log(`[cron] [${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

// 是否是交易时间
const isTradingTime = () => {
  const now = dayjs();
  const hour = now.hour();
  const minute = now.minute();

  // 开盘集合竞价：9:15 - 9:25
  const isOpenAuction = hour === 9 && minute >= 15 && minute <= 25;

  // 上午连续交易：9:30 - 11:30
  const isMorningTrading =
    (hour === 9 && minute >= 30) || // 9:30 及以后
    hour === 10 || // 10点整
    (hour === 11 && minute < 30); // 11:30 之前

  // 下午连续交易：13:00 - 15:00
  const isAfternoonTrading =
    (hour >= 13 && hour < 15) || // 13:00 - 14:59
    (hour === 15 && minute === 0); // 15:00

  return isOpenAuction || isMorningTrading || isAfternoonTrading;
};

const runStockScheduleJobs = () => {
  // 交易时段实时行情抓取
  // 开盘期间每5分钟抓取一次:
  // - 集合竞价: 9:15-9:25
  // - 连续竞价: 9:30-11:30, 13:00-15:00
  new CronJob("*/5 9-11,13-14 * * 1-5", async () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    if (!isTradingTime()) {
      print("not trade time");
      return;
    }

    print(`trigger seed stock quotes realtime`);

    await seedIndex();
    await seedStockQuotes();
  }).start();

  // 收盘后运行：16:00
  new CronJob("0 16 * * 1-5", async () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    print(`trigger seed stock quotes daily`);

    await seedStockBase();
    await seedStockQuotes();
    await seedDailyStockQuotes();
    await seedStockSelection();
  }).start();
};

const runNewsScheduleJobs = () => {
  // 工作日运行:
  // 交易时段 (9:00-11:30, 13:00-15:00) 每15分钟抓取一次
  // 其他时段 (8:30-9:00, 11:30-13:00, 15:00-21:30) 每30分钟抓取一次
  new CronJob("*/15 9-11,13-14 * * 1-5", () => {
    print("trigger seed news");
    seedNews();
  }).start();

  new CronJob("*/30 8,12,15-21 * * 1-5", () => {
    print("trigger seed news");
    seedNews();
  }).start();

  // 非工作日运行: 每小时抓取一次
  new CronJob("0 9-21 * * 0,6", () => {
    print("trigger seed news");
    seedNews();
  }).start();
};

const runClearScheduleJobs = () => {
  // 每天清晨 5:30 清理数据（在开盘前）
  new CronJob("30 5 * * *", () => {
    print("trigger clear data before trade");

    refreshTradeDates();
    cleanNews();
    cleanStockSelection();
    cleanStockQuotes();
  }).start();
};

const runSchedulerJobs = () => {
  runClearScheduleJobs();
  runStockScheduleJobs();
  runNewsScheduleJobs();
};

const runSeedJobs = async (runDate: string) => {
  await Promise.all([
    initStockBaseData(),
    initStockSelectionData(runDate),
    initStockQuotesData(runDate),
    initStockIndexData(runDate),
    initNewsData(runDate)
  ]);
};

async function main() {
  const runDate = getRunDate();

  console.log(`current time: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
  console.log(`run date: ${runDate}`);
  console.log(`run environment: ${process.env.NODE_ENV || "development"}`);

  if (process.env.NODE_ENV === "production") {
    console.log("refresh trade dates");
    await refreshTradeDates();
    console.log("run scheduler jobs");
    runSchedulerJobs();
    return;
  }

  console.log("Running seed jobs...");
  await runSeedJobs(runDate);
  console.log("Running seed jobs completed...");
}

main();
