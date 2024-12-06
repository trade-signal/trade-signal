import "dotenv/config";
import prisma from "../prisma/db";

console.log("Cron job running...");

async function main() {
  // Your cron job code here
  console.log("Cron job completed.");
}

main();
