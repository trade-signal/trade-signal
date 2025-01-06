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

// 是否是非交易时段
const isNonTradingTime = () => {
  const now = dayjs();
  const hour = now.hour();
  const minute = now.minute();

  return (
    (hour === 9 && minute < 15) || // 9:15 前
    (hour === 11 && minute >= 30) || // 11:30 后
    hour === 12 || // 午休时间
    (hour === 15 && minute > 0) // 15:00 后
  );
};

const runStockScheduleJobs = () => {
  // 交易时段实时行情抓取
  // 开盘期间每3分钟抓取一次:
  // - 集合竞价: 9:15-9:25
  // - 连续竞价: 9:30-11:30, 13:00-15:00
  // 注意: 非交易时段(午休等)会被 isNonTradingTime() 函数过滤
  new CronJob("*/3 9-11,13-14 * * 1-5", async () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    if (isNonTradingTime()) {
      print("not trade time");
      return;
    }

    print(`trigger seed stock quotes realtime`);

    await seedIndex();
    await seedStockQuotes();
  }).start();

  // 收盘后运行：16:00
  new CronJob("0 16 * * 1-5", () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    print(`trigger seed stock quotes daily`);

    seedStockBase();
    seedStockQuotes();
    seedDailyStockQuotes();
    seedStockSelection();
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
