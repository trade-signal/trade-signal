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
import { initStockBaseData } from "./stock/stock_base";
import { clearTradeDates, isTradeDate } from "./stock/trade_date";
import { createLogger } from "../shared/logger";

const logger = createLogger('cron', '', false)
const print = (message: string) => {
  logger.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

const runStockScheduleJobs = () => {
  // 工作日运行:
  // - 早盘前: 9:00
  // - 早盘中: 10:00
  // - 午间: 11:00
  // - 午盘中: 13:00
  // - 收盘后: 14:00
  // - 晚间: 15:00
  new CronJob("*/30 9,10,11,13,14,15 * * 1-5", () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    print("trigger seed stock quotes");

    seedStockQuotes();
  }).start();

  // 工作日运行：16:00
  new CronJob("0 16 * * 1-5", () => {
    if (!isTradeDate()) {
      print("not trade date");
      return;
    }

    print("trigger seed stock base");

    seedStockQuotes();
    seedDailyStockQuotes();
    seedStockSelection();
  }).start();
};

const runNewsScheduleJobs = () => {
  // 工作日运行:
  // - 早盘前: 8:30
  // - 早盘中: 10:00
  // - 午间: 12:00
  // - 午盘中: 14:00
  // - 收盘后: 15:30
  // - 晚间: 19:30, 21:30
  new CronJob("30 8,10,12,14,15,19,21 * * 1-5", () => {
    print("trigger seed news");

    seedNews();
  }).start();

  // 非工作日运行:
  // - 上午: 8:30, 10:30
  // - 下午: 14:30, 16:30
  // - 晚间: 19:30, 21:30
  new CronJob("30 8,10,14,16,19,21 * * 0,6", () => {
    print("trigger seed news");

    seedNews();
  }).start();
};

const runSchedulerJobs = () => {
  // 每天清晨 5:30 清理数据（在开盘前）
  new CronJob("30 5 * * *", () => {
    clearTradeDates();
    cleanNews();
    cleanStockSelection();
    cleanStockQuotes();
  }).start();

  runStockScheduleJobs();
  runNewsScheduleJobs();
};

const runSeedJobs = async (runDate: string) => {
  await Promise.all([
    initStockBaseData(),
    initStockSelectionData(runDate),
    initStockQuotesData(runDate),
    initNewsData(runDate)
  ]);
};

async function main() {
  const runDate = getRunDate();

  logger.info(`current time: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
  logger.info(`run date: ${runDate}`);
  logger.info(`run environment: ${process.env.NODE_ENV || "development"}`);

  if (process.env.NODE_ENV === "production") {
    logger.info("Running scheduler jobs...");
    runSchedulerJobs();
    return;
  }

  logger.info("Running seed jobs...");
  await runSeedJobs(runDate);
  logger.info("Running seed jobs completed...");
}

main();
