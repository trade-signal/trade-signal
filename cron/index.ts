import "dotenv/config";

import { CronJob } from "cron";
import dayjs from "dayjs";
import { getRunDate } from "@/shared/date";
import { initStockSelectionData, seedStockSelection } from "./stock/selection";
import { initTradeDates } from "./stock/trade_date";
import { initNewsData, seedNews } from "./news/news";

const print = (message: string) => {
  console.log(`[cron] [${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

const runSchedulerJobs = () => {
  // 工作日运行：16:00
  new CronJob("0 16 * * 1-5", async () => {
    print("Running seedStockSelection job...");
    await seedStockSelection();
    print("Running seedStockSelection job completed...");
  }).start();

  // 工作日运行:
  // - 早盘前: 8:30
  // - 早盘中: 10:00
  // - 午间: 12:00
  // - 午盘中: 14:00
  // - 收盘后: 15:30
  // - 晚间: 19:30, 21:30
  new CronJob("30 8,10,12,14,15,19,21 * * 1-5", async () => {
    print("Running seedNews job...");
    await seedNews();
    print("Running seedNews job completed...");
  }).start();

  // 非工作日运行:
  // - 上午: 8:30, 10:30
  // - 下午: 14:30, 16:30
  // - 晚间: 19:30, 21:30
  new CronJob("30 8,10,14,16,19,21 * * 0,6", async () => {
    print("Running seedNews job...");
    await seedNews();
    print("Running seedNews job completed...");
  }).start();
};

const runSeedJobs = async (runDate: string) => {
  await initTradeDates();
  await Promise.all([initNewsData(runDate), initStockSelectionData(runDate)]);
};

async function main() {
  console.log("Starting cron job...");

  const runDate = getRunDate();

  console.log(`当前时间: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
  console.log(`运行日期: ${runDate}`);
  console.log(`运行环境: ${process.env.NODE_ENV || "development"}`);

  await runSeedJobs(runDate);

  if (process.env.NODE_ENV === "production") {
    runSchedulerJobs();
  }

  console.log("Cron job completed.");
}

main();
