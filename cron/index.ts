import "dotenv/config";

import { CronJob } from "cron";
import { checkStocks, seedStockSelection } from "./stock/selection";

const initData = async () => {
  const hasStocks = await checkStocks();

  if (hasStocks) {
    console.log("Stocks available! No need to seed.");
    return;
  }

  await seedStockSelection();

  console.log("Stocks seeded successfully.");
};

const runDailyJob = () => {
  const job = new CronJob("30 17 * * 1-5", async () => {
    console.log("Running daily job...");

    await seedStockSelection();

    console.log("Daily job completed.");
  });
  job.start();
};

const initCron = () => {
  runDailyJob();
};

async function main() {
  console.log("Starting cron job...");

  await initData();

  if (process.env.NODE_ENV === "production") {
    initCron();
  }

  console.log("Cron job completed.");
}

main();
