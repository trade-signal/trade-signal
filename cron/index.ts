import "dotenv/config";

import { CronJob } from "cron";
import dayjs from "dayjs";
import { getRunDate } from "@/shared/date";
import { checkStocks, seedStockSelection } from "./stock/selection";
import { initTradeDates } from "./stock/trade_date";

// 每日运行
const runDailyJob = () => {
  const job = new CronJob("30 17 * * 1-5", async () => {
    console.log("Running daily job...");

    await seedStockSelection();

    console.log("Daily job completed.");
  });
  job.start();
};

// 运行定时任务
const runScheduleJobs = () => {
  runDailyJob();
};

const runStockSelectionJob = async (runDate: string) => {
  console.log("Running seedStockSelectionJob...");

  const hasStocks = await checkStocks(runDate);

  if (hasStocks) {
    console.log("Stocks available! No need to seed.");
    return;
  }

  await seedStockSelection(runDate);

  console.log("Stocks seeded successfully.");
};

async function main() {
  console.log("Starting cron job...");

  const runDate = getRunDate();

  console.log(`当前时间: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
  console.log(`运行日期: ${runDate}`);
  console.log(`运行环境: ${process.env.NODE_ENV || "development"}`);

  await initTradeDates();
  await runStockSelectionJob(runDate);

  if (process.env.NODE_ENV === "production") {
    runScheduleJobs();
  }

  console.log("Cron job completed.");
}

main();
