import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import Task from "@/cron/common/task";
import { getStockIndexBasic, quotesIndexBaseIndicatorMapping } from "../api";

const spider_name = "stock_index_base";
const print = createLogger(spider_name, "stock");

export const checkStockIndexBasic = async () => {
  const stocks = await prisma.stockIndexBasic.findMany({});
  return stocks.length > 0;
};

const upsertStockIndexBasic = async (list: any[]) => {
  for (const item of list) {
    await prisma.stockIndexBasic.upsert({
      where: { code: item.code },
      update: { ...item },
      create: { ...item }
    });
  }
};

export const fetchStockIndexBasic = async () => {
  const task = new Task("stock_index_basic", "eastmoney");

  try {
    print(`start get stock index basic`);

    await task.updateStatus("fetching");

    const stocks = await getStockIndexBasic({
      fields: getIndicatorFields(quotesIndexBaseIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock index basic is empty`);
      return;
    }

    await task.updateStatus("transforming");

    let list = transformStockData(stocks, quotesIndexBaseIndicatorMapping);

    print(`start upsert stock index basic`);

    await upsertStockIndexBasic(list);

    await task.updateStatus("completed", list.length);

    print(`upsert stock index basic success ${list.length}`);
  } catch (error) {
    await task.updateStatus("failed");
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
