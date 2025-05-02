import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import { getStockIndexBasic, quotesIndexBaseIndicatorMapping } from "../api";

const spider_name = "stock_index_base";
const print = createLogger(spider_name, "stock");

export const checkStockIndexBasic = async () => {
  const stocks = await prisma.stockIndexBasic.findMany({});
  return stocks.length > 0;
};

const upsertStockIndexBasic = async (list: any[]) => {
  const stocks = await prisma.stockIndexBasic.findMany({});

  if (stocks.length === 0) {
    await prisma.stockIndexBasic.createMany({
      data: list,
      skipDuplicates: true
    });
    return;
  }

  for (const item of list) {
    await prisma.stockIndexBasic.upsert({
      where: { code: item.code },
      update: { ...item },
      create: { ...item }
    });
  }
};

export const fetchStockIndexBasic = async () => {
  try {
    print(`start get stock index basic`);

    const stocks = await getStockIndexBasic({
      fields: getIndicatorFields(quotesIndexBaseIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock index basic is empty`);
      return;
    }

    const list = transformStockData(stocks, quotesIndexBaseIndicatorMapping);

    print(`start upsert stock index basic`);

    await upsertStockIndexBasic(list);

    print(`upsert stock index basic success ${list.length}`);
  } catch (error) {
    print(`get stock index basic error: ${error}`);
  }
};

export const initStockIndexBasic = async () => {
  const hasStockIndexBasic = await checkStockIndexBasic();

  if (hasStockIndexBasic) {
    print("stock index basic available! No need to fetch.");
    return;
  }

  await fetchStockIndexBasic();
};
