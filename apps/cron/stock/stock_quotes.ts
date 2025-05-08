import prisma from "@/packages/database/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/apps/core/cron/util";
import dayjs from "dayjs";
import { getStockQuotes, quotesIndicatorMapping } from "../api";

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
  const stocks = await prisma.stockQuotes.findMany({
    select: {
      date: true
    }
  });

  if (stocks.length === 0) {
    while (list.length > 0) {
      const batch = list.splice(0, 200);

      await prisma.stockQuotes.createMany({
        data: batch,
        skipDuplicates: true
      });
    }
    return;
  }

  while (list.length > 0) {
    const batch = list.splice(0, 200);

    await Promise.all(
      batch.map(async item => {
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
      })
    );

    print(`upsert ${batch.length} stocks, left ${list.length}`);
  }
};

export const fetchStockQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  try {
    print(`start get stock quotes`);

    const stocks = await getStockQuotes({
      fields: getIndicatorFields(quotesIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock quotes is empty`);
      return;
    }

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

    print(`upsert stock quotes success ${list.length}`);
  } catch (error) {
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
