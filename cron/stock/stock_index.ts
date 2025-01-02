import prisma from "@/prisma/db";
import { createLogger, transformStockData, getIndicatorFields } from "../util";
import dayjs from "dayjs";
import { updateBatchStatus } from "../batch";
import { initBatch } from "../batch";
import { getRealTimeIndexQuotes, quotesIndexIndicatorMapping } from "./api";

const spider_name = "stock_index";
const print = createLogger(spider_name, "stock");

// 清除超过7个交易日的数据，避免数据量过大
export const cleanStockIndex = async () => {
  print("clean stock index");

  const tradingDays = await prisma.stockIndexRealTime.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" }
  });

  if (tradingDays.length > 7) {
    const cutoffDate = tradingDays[6].date;
    const result = await prisma.stockIndexRealTime.deleteMany({
      where: { date: { lt: cutoffDate } }
    });

    print(`clean ${result.count} data`);
    return;
  }
  print("no data to clean");
};

export const seedIndex = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const batch = await initBatch("stock_index", "eastmoney");

  try {
    print(`start get realtimeIndexQuotes`);

    await updateBatchStatus(batch.id, "fetching");

    const stocks = await getRealTimeIndexQuotes({
      fields: getIndicatorFields(quotesIndexIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    await updateBatchStatus(batch.id, "transforming");

    let list = transformStockData(stocks, quotesIndexIndicatorMapping);
    // 添加日期
    list = list.map(item => ({ ...item, date: currentDate }));

    print(`start write realtimeIndexQuotes`);

    await prisma.stockIndexRealTime.createMany({
      data: list as any,
      skipDuplicates: true
    });

    await updateBatchStatus(batch.id, "completed", list.length);
  } catch (error) {
    await updateBatchStatus(batch.id, "failed");
    print(`error: ${error}`);
  }
};

export const checkStockIndex = async (date?: string) => {
  const quotes = await prisma.stockIndexRealTime.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return quotes.length > 0;
};

export const initStockIndexData = async (date?: string) => {
  const hasQuotes = await checkStockIndex(date);

  if (hasQuotes) {
    print("realtimeIndexQuotes available! No need to seed.");
    return;
  }

  await seedIndex(date);
};
