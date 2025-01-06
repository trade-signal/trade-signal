import prisma from "@/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/cron/util";
import dayjs from "dayjs";
import { updateBatchStatus, initBatch } from "@/cron/common/batch";
import { getRealtimeStockQuotes, quotesIndicatorMapping } from "./api";

const spider_name = "stock_quotes";
const print = createLogger(spider_name, "stock");

// 清除超过7个交易日的数据，避免数据量过大
export const cleanStockQuotes = async () => {
  print("clean stock quotes");

  const tradingDays = await prisma.stockQuotesRealTime.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" }
  });

  if (tradingDays.length > 7) {
    const cutoffDate = tradingDays[6].date;
    const result = await prisma.stockQuotesRealTime.deleteMany({
      where: { date: { lt: cutoffDate } }
    });

    print(`clean ${result.count} data`);
    return;
  }
  print("no data to clean");
};

export const seedStockQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const batch = await initBatch("stock_quotes", "eastmoney");

  try {
    print(`start get realtimeStockQuotes`);

    await updateBatchStatus(batch.id, "fetching");

    const stocks = await getRealtimeStockQuotes({
      fields: getIndicatorFields(quotesIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`realtimeStockQuotes is empty`);
      return;
    }

    await updateBatchStatus(batch.id, "transforming");

    let list = transformStockData(stocks, quotesIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => Number(item.newPrice) > 0);
    // 添加日期
    list = list.map(item => ({
      ...item,
      ts: Date.now(),
      date: currentDate
    }));

    print(`start write realtimeStockQuotes`);

    const result = await prisma.stockQuotesRealTime.createMany({
      data: list as any,
      skipDuplicates: true
    });

    await updateBatchStatus(batch.id, "completed", result.count);

    print(`write realtimeStockQuotes success ${result.count}`);
  } catch (error) {
    await updateBatchStatus(batch.id, "failed");
    print(`getRealtimeStockQuotes error: ${error}`);
  }
};

export const checkStockQuotes = async (date?: string) => {
  const quotes = await prisma.stockQuotesRealTime.findMany({
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
