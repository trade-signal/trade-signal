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
import { createLogger } from "@/shared/logger";

const logger = createLogger("cron", "", false);
const print = (message: string) => {
  logger.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

// 是否是交易时间
const isTradingTime = () => {
  const now = dayjs();
  const hour = now.hour();
  const minute = now.minute();

  // 上午连续交易：9:30 - 11:30
  const isMorningTrading =
    (hour === 9 && minute >= 30) || // 9:30 及以后
    hour === 10 || // 10点整
    (hour === 11 && minute < 30); // 11:30 之前

  // 下午连续交易：13:00 - 15:00
  const isAfternoonTrading =
    (hour >= 13 && hour < 15) || // 13:00 - 14:59
    (hour === 15 && minute === 0); // 15:00

  return isMorningTrading || isAfternoonTrading;
};

const runStockScheduleJobs = () => {
  // 交易时段实时行情抓取
  // 交易时段每30分钟抓取一次:
  // - 9:30-11:30, 13:00-15:00
  new CronJob("*/30 9-11,13-14 * * 1-5", async () => {
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

    cleanStockSelection();
    cleanNews(3);
    cleanStockQuotes(3);
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

  logger.info(`current time: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
  logger.info(`run date: ${runDate}`);
  logger.info(`run environment: ${process.env.NODE_ENV || "development"}`);

  if (process.env.NODE_ENV === "production") {
    logger.info("refresh trade dates");
    await refreshTradeDates();
    logger.info("run scheduler jobs");
    runSchedulerJobs();
    return;
  }

  logger.info("Running seed jobs...");
  await runSeedJobs(runDate);
  logger.info("Running seed jobs completed...");
}

main();
