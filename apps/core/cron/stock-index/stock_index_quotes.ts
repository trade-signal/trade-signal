import prisma from "@/packages/database/prisma/db";
import {
  createLogger,
  transformStockData,
  getIndicatorFields
} from "@/apps/core/cron/util";
import dayjs from "dayjs";
import { getStockIndexQuotes, quotesIndexIndicatorMapping } from "../api";

const spider_name = "stock_index_quotes";
const print = createLogger(spider_name, "stock");

const upsertStockIndexQuotes = async (list: any[]) => {
  for (const item of list) {
    await prisma.stockIndexQuotes.upsert({
      where: { date_code: { date: item.date, code: item.code } },
      update: { ...item },
      create: { ...item }
    });
  }
};

export const cleanStockIndexQuotes = async (days: number = 7) => {
  print(`clean stock index quotes older than ${days} days`);

  const tradingDays = await prisma.stockIndexQuotes.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" }
  });

  if (tradingDays.length > days) {
    const cutoffDate = tradingDays[days - 1].date;
    const result = await prisma.stockIndexQuotes.deleteMany({
      where: { date: { lt: cutoffDate } }
    });

    print(`clean ${result.count} data`);
    return;
  }

  print("no data to clean");
};

export const fetchStockIndexQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  try {
    print(`start get stock index quotes`);

    const stocks = await getStockIndexQuotes({
      fields: getIndicatorFields(quotesIndexIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    let list = transformStockData(stocks, quotesIndexIndicatorMapping);
    // 添加日期
    list = list.map(item => ({
      ...item,
      date: currentDate
    }));

    print(`start upsert stock index`);

    await upsertStockIndexQuotes(list);

    print(`upsert stock index quotes success ${list.length}`);
  } catch (error) {
    print(`error: ${error}`);
  }
};

export const checkStockIndexQuotes = async (date?: string) => {
  const quotes = await prisma.stockIndexQuotes.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return quotes.length > 0;
};

export const initStockIndexQuotes = async (date?: string) => {
  const hasQuotes = await checkStockIndexQuotes(date);

  if (hasQuotes) {
    print("stock index quotes available! No need to fetch.");
    return;
  }

  await fetchStockIndexQuotes(date);
};
