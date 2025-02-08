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

const upsertStockBasic = async (list: any[]) => {
  for (const item of list) {
    await prisma.stockBasic.upsert({
      where: { code: item.code },
      update: { ...item, status: item.newPrice > 0 ? "active" : "suspended" },
      create: { ...item, status: item.newPrice > 0 ? "active" : "suspended" }
    });
  }
};

export const fetchStockBasic = async () => {
  const task = await initTask("stock_base", "eastmoney");

  try {
    print(`start get stock basic`);

    await updateTaskStatus(task.id, "fetching");

    const stocks = await getRealtimeStockQuotes({
      fields: getIndicatorFields(quotesBaseIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock basic is empty`);
      return;
    }

    await updateTaskStatus(task.id, "transforming");

    let list = transformStockData(stocks, quotesBaseIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => item.newPrice > 0);

    print(`start upsert stock basic`);

    await upsertStockBasic(list);

    await updateTaskStatus(task.id, "completed", list.length);

    print(`upsert stock basic success ${list.length}`);
  } catch (error) {
    await updateTaskStatus(task.id, "failed");
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
