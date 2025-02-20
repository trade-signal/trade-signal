import "dotenv/config";

import { CronJob } from "cron";
import dayjs from "dayjs";
import { getRunDate, isTradingTime } from "@/shared/date";
import { createLogger } from "@/shared/logger";

import { cleanNews, initNews, fetchNews } from "./news";

import {
  cleanStockScreener,
  initStockScreener,
  fetchStockScreener
} from "./stock/stock_screener";

import { isTradeDate, refreshTradeDates } from "./common/trade_date";
import { initStockBasic, fetchStockBasic } from "./stock/stock_basic";
import {
  initStockIndexBasic,
  fetchStockIndexBasic
} from "./stock-index/stock_index_basic";
import {
  initStockPlateBasic,
  fetchStockPlateBasic
} from "./stock-plate/stock_plate_basic";

import {
  initStockQuotes,
  fetchStockQuotes,
  cleanStockQuotes
} from "./stock/stock_quotes";
import {
  initStockIndexQuotes,
  fetchStockIndexQuotes,
  cleanStockIndexQuotes
} from "./stock-index/stock_index_quotes";
import {
  initStockPlateQuotes,
  fetchStockPlateQuotes,
  cleanStockPlateQuotes
} from "./stock-plate/stock_plate_quotes";

import {
  cleanActiveStockMinuteKline,
  fetchActiveStockMinuteKline,
  initStockMinuteKline
} from "./stock/stock_minute_kline";
import {
  cleanActiveStockIndexMinuteKline,
  fetchActiveStockIndexMinuteKline,
  initStockIndexMinuteKline
} from "./stock-index/stock_index_minute_kline";
import { cleanActiveStocks, initActiveStocks } from "./stock/stock_active";
import {
  cleanActiveStocksIndex,
  initActiveStockIndex
} from "./stock-index/stock_index_active";

const logger = createLogger("cron", "", false);
const print = (message: string) => {
  logger.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

// 交易时段 实时行情抓取
const runStockTrendingJobs = async () => {
  await fetchStockIndexQuotes();
  await fetchActiveStockIndexMinuteKline();
  await fetchStockQuotes();
  await fetchActiveStockMinuteKline();
  await fetchStockPlateQuotes();
};

const runStockScheduleJobs = () => {
  // 交易时段实时行情抓取
  // 交易时段每10分钟抓取一次:
  // 9:15-11:30, 13:00-15:00
  new CronJob("*/10 9-11,13-14 * * 1-5", async () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    if (!isTradingTime()) {
      print("not trade time");
      return;
    }

    print(`trigger fetch stock quotes realtime`);

    await runStockTrendingJobs();
  }).start();

  // 收盘后运行：16:00
  new CronJob("0 16 * * 1-5", async () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    print(`trigger fetch stock quotes daily`);

    await runStockTrendingJobs();
    await fetchStockScreener();
  }).start();

  // 每月1号运行：更新所有股票和指数的基本信息
  new CronJob("0 0 1 * *", async () => {
    await fetchStockBasic();
    await fetchStockIndexBasic();
    await fetchStockPlateBasic();
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

    await cleanNews(3);

    await cleanStockScreener();
    await Promise.all([cleanActiveStocks(), cleanActiveStocksIndex()]);

    await Promise.all([
      cleanStockQuotes(3),
      cleanStockIndexQuotes(3),
      cleanStockPlateQuotes(3)
    ]);
    await Promise.all([
      cleanActiveStockMinuteKline(3),
      cleanActiveStockIndexMinuteKline(3)
    ]);
  }).start();
};

const runSchedulerJobs = () => {
  runClearScheduleJobs();
  runStockScheduleJobs();
  runNewsScheduleJobs();
};

const runSeedJobs = async (runDate: string) => {
  try {
    await Promise.all([
      initStockBasic(),
      initStockIndexBasic(),
      initStockPlateBasic()
    ]);
    await Promise.all([initStockScreener(runDate), initNews(runDate)]);
    await Promise.all([
      initStockQuotes(runDate),
      initStockIndexQuotes(runDate),
      initStockPlateQuotes(runDate)
    ]);
    await Promise.all([initActiveStocks(), initActiveStockIndex()]);
    await Promise.all([
      initStockMinuteKline(runDate),
      initStockIndexMinuteKline(runDate)
    ]);
  } catch (error) {
    logger.error(`run seed jobs error: ${error}`);
  }
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
