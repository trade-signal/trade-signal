import prisma from "@/prisma/db";
import {
  createLogger,
  transformStockData,
  getIndicatorFields
} from "@/cron/util";
import dayjs from "dayjs";
import { updateTaskStatus, initTask } from "@/cron/common/task";
import { getRealTimeIndexQuotes, quotesIndexIndicatorMapping } from "./api";

const spider_name = "stock_index";
const print = createLogger(spider_name, "stock");

// 清除超过指定天数的数据
export const cleanStockIndex = async (days: number = 7) => {
  print(`clean stock index older than ${days} days`);

  const tradingDays = await prisma.stockIndexMinuteKline.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" }
  });


  if (tradingDays.length > days) {
    const cutoffDate = tradingDays[days - 1].date;
    const result = await prisma.stockIndexMinuteKline.deleteMany({
      where: { date: { lt: cutoffDate } }
    });

    print(`clean ${result.count} data`);
    return;
  }
  print("no data to clean");
};

export const seedIndex = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const task = await initTask("stock_index_minute_kline", "eastmoney");
  try {
    print(`start get realtimeIndexQuotes`);

    await updateTaskStatus(task.id, "fetching");

    const stocks = await getRealTimeIndexQuotes({
      fields: getIndicatorFields(quotesIndexIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    await updateTaskStatus(task.id, "transforming");

    let list = transformStockData(stocks, quotesIndexIndicatorMapping);
    // 添加日期
    list = list.map(item => ({
      ...item,
      ts: Date.now(),
      date: currentDate
    }));

    print(`start write realtimeIndexQuotes`);

    const result = await prisma.stockIndexMinuteKline.createMany({
      data: list as any,
      skipDuplicates: true
    });

    await updateTaskStatus(task.id, "completed", result.count);

    print(`write realtimeIndexQuotes success ${result.count}`);
  } catch (error) {
    await updateTaskStatus(task.id, "failed");
    print(`error: ${error}`);
  }
};

export const checkStockIndex = async (date?: string) => {
  const quotes = await prisma.stockIndexMinuteKline.findMany({
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
