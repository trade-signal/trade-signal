import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import Task from "@/cron/common/task";
import { getStockBasic, quotesBaseIndicatorMapping } from "../api";

const spider_name = "stock_base";
const print = createLogger(spider_name, "stock");

export const checkStockBasic = async () => {
  const stocks = await prisma.stockBasic.findMany({});
  return stocks.length > 0;
};

const upsertStockBasic = async (list: any[]) => {
  for (const item of list) {
    delete item.newPrice;

    await prisma.stockBasic.upsert({
      where: { code: item.code },
      update: { ...item },
      create: { ...item }
    });
  }
};

export const fetchStockBasic = async () => {
  const task = new Task("stock_basic", "eastmoney");

  try {
    print(`start get stock basic`);

    await task.updateStatus("fetching");

    const stocks = await getStockBasic({
      fields: getIndicatorFields(quotesBaseIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock basic is empty`);
      return;
    }

    await task.updateStatus("transforming");

    let list = transformStockData(stocks, quotesBaseIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => item.newPrice > 0);

    print(`start upsert stock basic`);

    await upsertStockBasic(list);

    await task.updateStatus("completed", list.length);

    print(`upsert stock basic success ${list.length}`);
  } catch (error) {
    await task.updateStatus("failed");
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
