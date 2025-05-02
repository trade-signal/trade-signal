import prisma from "@/prisma/db";
import {
  createLogger,
  transformStockData,
  getIndicatorFields
} from "@/cron/util";
import dayjs from "dayjs";
import { getStockPlateQuotes, quotesPlateIndicatorMapping } from "../api";

const spider_name = "stock_plate_quotes";
const print = createLogger(spider_name, "stock");

const upsertStockPlateQuotes = async (list: any[]) => {
  for (const item of list) {
    await prisma.stockPlateQuotes.upsert({
      where: { date_code: { date: item.date, code: item.code } },
      update: { ...item },
      create: { ...item }
    });
  }
};

export const cleanStockPlateQuotes = async (days: number = 7) => {
  print(`clean stock plate quotes older than ${days} days`);

  const tradingDays = await prisma.stockPlateQuotes.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" }
  });

  if (tradingDays.length > days) {
    const cutoffDate = tradingDays[days - 1].date;
    const result = await prisma.stockPlateQuotes.deleteMany({
      where: { date: { lt: cutoffDate } }
    });

    print(`clean ${result.count} data`);
    return;
  }

  print("no data to clean");
};

export const fetchStockPlateQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  try {
    print(`start get stock plate quotes`);

    const stocks = await getStockPlateQuotes({
      fields: getIndicatorFields(quotesPlateIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    let list = transformStockData(stocks, quotesPlateIndicatorMapping);
    // 添加日期
    list = list.map(item => ({
      ...item,
      date: currentDate
    }));

    print(`start upsert stock plate quotes`);

    await upsertStockPlateQuotes(list);

    print(`upsert stock plate quotes success ${list.length}`);
  } catch (error) {
    print(`fetch stock plate quotes error: ${error}`);
  }
};

export const checkStockPlateQuotes = async (date?: string) => {
  const quotes = await prisma.stockPlateQuotes.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return quotes.length > 0;
};

export const initStockPlateQuotes = async (date?: string) => {
  const hasStockPlateQuotes = await checkStockPlateQuotes(date);

  if (hasStockPlateQuotes) {
    print("stock plate quotes available! No need to fetch.");
    return;
  }

  await fetchStockPlateQuotes(date);
};
