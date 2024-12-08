import "dotenv/config";

const initData = async () => {};

async function main() {
  console.log("Starting cron job...");

  await initData();

  console.log("Cron job completed.");
}

main();
