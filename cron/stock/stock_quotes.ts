import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import dayjs from "dayjs";
import { updateTaskStatus, initTask } from "@/cron/common/task";
import { getRealtimeStockQuotes, quotesIndicatorMapping } from "./api";

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

const seedRealtimeStockQuotes = async (list: any[]) => {
  const result = await prisma.stockQuotes.createMany({
    data: list.map(item => ({
      ...item,
      ts: Date.now()
    })),
    skipDuplicates: true
  });
};

const seedLatestStockQuotes = async (list: any[]) => {
  const lastUpdateTs = Date.now();

  for (const item of list) {
    await prisma.stockQuotes.upsert({
      where: {
        date_code: {
          date: item.date,
          code: item.code
        }
      },
      update: { ...item, lastUpdateTs },
      create: { ...item, lastUpdateTs }
    });
  }
};

export const seedStockQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const task = await initTask("stock_quotes", "eastmoney");

  try {
    print(`start get realtimeStockQuotes`);

    await updateTaskStatus(task.id, "fetching");

    const stocks = await getRealtimeStockQuotes({
      fields: getIndicatorFields(quotesIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`realtimeStockQuotes is empty`);
      return;
    }

    await updateTaskStatus(task.id, "transforming");

    let list = transformStockData(stocks, quotesIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => Number(item.newPrice) > 0);
    // 添加日期
    list = list.map(item => ({
      ...item,
      date: currentDate
    }));

    print(`start write realtimeStockQuotes`);

    await seedRealtimeStockQuotes(list);
    await seedLatestStockQuotes(list);

    await updateTaskStatus(task.id, "completed", list.length);

    print(`write realtimeStockQuotes success ${list.length}`);
  } catch (error) {
    await updateTaskStatus(task.id, "failed");
    print(`getRealtimeStockQuotes error: ${error}`);
  }
};

export const checkStockQuotes = async (date?: string) => {
  const quotes = await prisma.stockQuotes.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return quotes.length > 0;
};

export const initStockQuotesData = async (date?: string) => {
  const hasQuotes = await checkStockQuotes(date);

  if (hasQuotes) {
    print("realtimeStockQuotes available! No need to seed.");
    return;
  }

  await seedStockQuotes(date);
};
