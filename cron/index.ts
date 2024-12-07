import "dotenv/config";

import { checkStock, seedStocks } from "./stock/names";

const initData = async () => {
  const hasStock = await checkStock();

  if (hasStock) {
    console.log("Stock available! No need to seed.");
    return;
  }

  await seedStocks();
};

async function main() {
  console.log("Starting cron job...");

  await initData();

  console.log("Cron job completed.");
}

main();
