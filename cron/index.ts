import "dotenv/config";

import { CronJob } from "cron";
import dayjs from "dayjs";
import { getRunDate, isTradingTime } from "@/shared/date";
import {
  cleanStockScreener,
  initStockScreener,
  fetchStockScreener
} from "./stock/stock_screener";

import { cleanNews, initNews, fetchNews } from "./news";
import {
  cleanStockQuotes,
  initStockQuotes,
  fetchStockQuotes
} from "./stock/stock_quotes";

import { initStockBasic, fetchStockBasic } from "./stock/stock_basic";
import {
  initStockIndexBasic,
  fetchStockIndexBasic
} from "./stock-index/stock_index_basic";
import { isTradeDate, refreshTradeDates } from "./common/trade_date";

import {
  initStockIndexQuotes,
  fetchStockIndexQuotes
} from "./stock-index/stock_index_quotes";

import { createLogger } from "@/shared/logger";

const logger = createLogger("cron", "", false);
const print = (message: string) => {
  logger.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

const runStockScheduleJobs = () => {
  // 交易时段实时行情抓取
  // 交易时段每3分钟抓取一次:
  // - 9:30-11:30, 13:00-15:00
  new CronJob("*/3 9-11,13-14 * * 1-5", async () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    if (!isTradingTime()) {
      print("not trade time");
      return;
    }

    print(`trigger fetch stock quotes realtime`);

    await fetchStockIndexQuotes();
    await fetchStockQuotes();
  }).start();

  // 收盘后运行：16:00
  new CronJob("0 16 * * 1-5", async () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    print(`trigger fetch stock quotes daily`);

    await fetchStockBasic();
    await fetchStockIndexBasic();
    await fetchStockQuotes();
    await fetchStockScreener();
  }).start();
};

const runNewsScheduleJobs = () => {
  // 工作日运行:
  // 交易时段 (9:00-11:30, 13:00-15:00) 每15分钟抓取一次
  // 其他时段 (8:30-9:00, 11:30-13:00, 15:00-21:30) 每30分钟抓取一次
  new CronJob("*/15 9-11,13-14 * * 1-5", () => {
    print("trigger fetch news");
    fetchNews();
  }).start();

  new CronJob("*/30 8,12,15-21 * * 1-5", () => {
    print("trigger fetch news");
    fetchNews();
  }).start();

  // 非工作日运行: 每小时抓取一次
  new CronJob("0 9-21 * * 0,6", () => {
    print("trigger fetch news");
    fetchNews();
  }).start();
};

const runClearScheduleJobs = () => {
  // 每天清晨 5:30 清理数据（在开盘前）
  new CronJob("30 5 * * *", async () => {
    print("trigger clear data before trade");

    await refreshTradeDates();

    await cleanStockScreener();
    await cleanNews(3);
    await cleanStockQuotes(3);
  }).start();
};

const runSchedulerJobs = () => {
  runClearScheduleJobs();
  runStockScheduleJobs();
  runNewsScheduleJobs();
};

const runSeedJobs = async (runDate: string) => {
  await Promise.all([initStockBasic(), initStockIndexBasic()]);
  await Promise.all([
    initStockScreener(runDate),
    initStockQuotes(runDate),
    initStockIndexQuotes(runDate),
    initNews(runDate)
  ]);
};

async function main() {
  const runDate = getRunDate();

  const isProd = process.env.NODE_ENV === "production";

  logger.info(`current time: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
  logger.info(`run date: ${runDate}`);
  logger.info(`run environment: ${isProd ? "production" : "development"}`);

  logger.info("Running seed jobs...");
  await runSeedJobs(runDate);
  logger.info("Running seed jobs completed...");

  if (!isProd) return;

  logger.info("refresh trade dates");
  await refreshTradeDates();
  logger.info("run scheduler jobs");
  runSchedulerJobs();
}

main();
