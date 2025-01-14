import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import { updateBatchStatus, initBatch } from "@/cron/common/batch";
import { getRealtimeStockQuotes, quotesBaseIndicatorMapping } from "./api";

const spider_name = "stock_base";
const print = createLogger(spider_name, "stock");

export const checkStockBase = async () => {
  const stocks = await prisma.stock.findMany({});
  return stocks.length > 0;
};

export const seedStockBase = async () => {
  const batch = await initBatch("stock_base", "eastmoney");

  try {
    print(`start get stock base`);

    await updateBatchStatus(batch.id, "fetching");

    const stocks = await getRealtimeStockQuotes({
      fields: getIndicatorFields(quotesBaseIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock base is empty`);
      return;
    }

    await updateBatchStatus(batch.id, "transforming");

    let list = transformStockData(stocks, quotesBaseIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => item.newPrice > 0);

    print(`start write stock base`);

    const result = await prisma.stock.createMany({
      data: list.map(item => {
        const { newPrice, ...rest } = item;
        return {
          ...rest,
          status: newPrice > 0 ? "active" : "suspended"
        };
      }),
      skipDuplicates: true
    });

    await updateBatchStatus(batch.id, "completed", result.count);

    print(`write stock base success ${result.count}`);
  } catch (error) {
    await updateBatchStatus(batch.id, "failed");
    print(`getStockBase error: ${error}`);
  }
};

export const initStockBaseData = async () => {
  const hasStockBase = await checkStockBase();

  if (hasStockBase) {
    print("stock base available! No need to seed.");
    return;
  }

  await seedStockBase();
};
