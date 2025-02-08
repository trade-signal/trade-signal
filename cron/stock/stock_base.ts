import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import { updateTaskStatus, initTask } from "@/cron/common/task";
import { getRealtimeStockQuotes, quotesBaseIndicatorMapping } from "./api";

const spider_name = "stock_base";
const print = createLogger(spider_name, "stock");

export const checkStockBasic = async () => {
  const stocks = await prisma.stockBasic.findMany({});
  return stocks.length > 0;
};

export const seedStockBase = async () => {
  const task = await initTask("stock_base", "eastmoney");

  try {
    print(`start get stock base`);

    await updateTaskStatus(task.id, "fetching");

    const stocks = await getRealtimeStockQuotes({
      fields: getIndicatorFields(quotesBaseIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock base is empty`);
      return;
    }

    await updateTaskStatus(task.id, "transforming");

    let list = transformStockData(stocks, quotesBaseIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => item.newPrice > 0);

    print(`start write stock base`);

    const result = await prisma.stockBasic.createMany({
      data: list.map(item => {
        const { newPrice, ...rest } = item;
        return {
          ...rest,
          status: newPrice > 0 ? "active" : "suspended"
        };
      }),
      skipDuplicates: true
    });

    await updateTaskStatus(task.id, "completed", result.count);

    print(`write stock base success ${result.count}`);
  } catch (error) {
    await updateTaskStatus(task.id, "failed");
    print(`getStockBase error: ${error}`);
  }
};

export const initStockBaseData = async () => {
  const hasStockBasic = await checkStockBasic();

  if (hasStockBasic) {
    print("stock base available! No need to seed.");
    return;
  }

  await seedStockBase();
};
