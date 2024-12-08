import "dotenv/config";
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

async function main() {
  console.log("Starting cron job...");

  await initData();

  console.log("Cron job completed.");
}

main();
