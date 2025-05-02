import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import { getStockBasic, quotesBaseIndicatorMapping } from "../api";

const spider_name = "stock_base";
const print = createLogger(spider_name, "stock");

export const checkStockBasic = async () => {
  const stocks = await prisma.stockBasic.findMany({});
  return stocks.length > 0;
};

const upsertStockBasic = async (list: any[]) => {
  const stocks = await prisma.stockBasic.findMany({});

  const data = list.map(item => {
    delete item.newPrice;
    return item;
  });

  if (stocks.length === 0) {
    while (data.length > 0) {
      const batch = data.splice(0, 200);

      await prisma.stockBasic.createMany({
        data: batch,
        skipDuplicates: true
      });
    }
    return;
  }

  while (data.length > 0) {
    const batch = data.splice(0, 200);

    await Promise.all(
      batch.map(async item => {
        await prisma.stockBasic.upsert({
          where: { code: item.code },
          update: { ...item },
          create: { ...item }
        });
      })
    );

    print(`upsert ${batch.length} stocks, left ${data.length}`);
  }
};

export const fetchStockBasic = async () => {
  try {
    print(`start get stock basic`);

    const stocks = await getStockBasic({
      fields: getIndicatorFields(quotesBaseIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock basic is empty`);
      return;
    }

    let list = transformStockData(stocks, quotesBaseIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => item.newPrice > 0);

    print(`start upsert stock basic`);

    await upsertStockBasic(list);

    print(`upsert stock basic success ${list.length}`);
  } catch (error) {
    print(`get stock basic error: ${error}`);
  }
};

export const initStockBasic = async () => {
  const hasStockBasic = await checkStockBasic();

  if (hasStockBasic) {
    print("stock basic available! No need to fetch.");
    return;
  }

  await fetchStockBasic();
};
