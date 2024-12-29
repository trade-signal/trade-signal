import "dotenv/config";

import { CronJob } from "cron";
import dayjs from "dayjs";
import { getRunDate } from "@/shared/date";
import {
  initStockSelectionData,
  seedStockSelection
} from "./stock/stock_selection";
import { initNewsData, seedNews } from "./news";
import { initStockQuotesData, seedStockQuotes } from "./stock/stock_quotes";
import { initStockBaseData, seedStockBase } from "./stock/stock_base";

const print = (message: string) => {
  console.log(`[cron] [${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

const runSchedulerJobs = () => {
  // 工作日运行:
  // - 早盘前: 9:00
  // - 早盘中: 10:00
  // - 午间: 11:00
  // - 午盘中: 13:00
  // - 收盘后: 14:00
  // - 晚间: 15:00
  new CronJob("*/30 9,10,11,13,14,15 * * 1-5", () => {
    seedStockQuotes();
  }).start();

  // 工作日运行：16:00
  new CronJob("0 16 * * 1-5", () => {
    seedStockBase();
    seedStockQuotes();
    seedStockSelection();
  }).start();

  // 工作日运行:
  // - 早盘前: 8:30
  // - 早盘中: 10:00
  // - 午间: 12:00
  // - 午盘中: 14:00
  // - 收盘后: 15:30
  // - 晚间: 19:30, 21:30
  new CronJob("30 8,10,12,14,15,19,21 * * 1-5", () => {
    seedNews();
  }).start();

  // 非工作日运行:
  // - 上午: 8:30, 10:30
  // - 下午: 14:30, 16:30
  // - 晚间: 19:30, 21:30
  new CronJob("30 8,10,14,16,19,21 * * 0,6", () => {
    seedNews();
  }).start();
};

const runSeedJobs = async (runDate: string) => {
  await Promise.all([
    initNewsData(runDate),
    initStockBaseData(),
    initStockSelectionData(runDate),
    initStockQuotesData(runDate)
  ]);
};

async function main() {
  const runDate = getRunDate();

  console.log(`current time: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
  console.log(`run date: ${runDate}`);
  console.log(`run environment: ${process.env.NODE_ENV || "development"}`);

  if (process.env.NODE_ENV === "production") {
    console.log("Running scheduler jobs...");
    runSchedulerJobs();
    return;
  }

  console.log("Running seed jobs...");
  await runSeedJobs(runDate);
  console.log("Running seed jobs completed...");
}

main();
