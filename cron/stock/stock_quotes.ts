import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import dayjs from "dayjs";
import Task from "@/cron/common/task";
import { getStockQuotes, quotesIndicatorMapping } from "./api";

const spider_name = "stock_quotes";
const print = createLogger(spider_name, "stock");

// 清除超过指定天数的数据
export const cleanStockQuotes = async (days: number = 7) => {
  try {
    print(`clean stock quotes older than ${days} days`);

    const tradingDays = await prisma.stockQuotes.findMany({
      select: { date: true },
      distinct: ["date"],
      orderBy: { date: "desc" }
    });

    if (tradingDays.length > days) {
      const cutoffDate = tradingDays[days - 1].date;
      const result = await prisma.stockQuotes.deleteMany({
        where: { date: { lt: cutoffDate } }
      });

      print(`clean ${result.count} data`);
      return;
    }

    print("no data to clean");
  } catch (error) {
    print(`clean stock quotes error: ${error}`);
  }
};

const upsertStockQuotes = async (list: any[]) => {
  for (const item of list) {
    await prisma.stockQuotes.upsert({
      where: {
        date_code: {
          date: item.date,
          code: item.code
        }
      },
      update: { ...item },
      create: { ...item }
    });
  }
};

export const fetchStockQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const task = new Task("stock_quotes", "eastmoney");

  try {
    print(`start get stock quotes`);

    await task.updateStatus("fetching");

    const stocks = await getStockQuotes({
      fields: getIndicatorFields(quotesIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock quotes is empty`);
      return;
    }

    await task.updateStatus("transforming");

    let list = transformStockData(stocks, quotesIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => Number(item.newPrice) > 0);
    // 添加日期
    list = list.map(item => ({
      ...item,
      date: currentDate
    }));

    print(`start upsert stock quotes`);

    await upsertStockQuotes(list);

    await task.updateStatus("completed", list.length);

    print(`upsert stock quotes success ${list.length}`);
  } catch (error) {
    await task.updateStatus("failed");
    print(`get stock quotes error: ${error}`);
  }
};

export const checkStockQuotes = async (date?: string) => {
  const quotes = await prisma.stockQuotes.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return quotes.length > 0;
};

export const initStockQuotes = async (date?: string) => {
  const hasQuotes = await checkStockQuotes(date);

  if (hasQuotes) {
    print("stock quotes available! No need to fetch.");
    return;
  }

  await fetchStockQuotes(date);
};
