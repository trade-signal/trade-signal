import prisma from "@/prisma/db";
import {
  createLogger,
  transformStockData,
  getIndicatorFields
} from "@/cron/util";
import dayjs from "dayjs";
import { updateTaskStatus, initTask } from "@/cron/common/task";
import { getRealtimeStockQuotes, quotesDailyIndicatorMapping } from "./api";

const spider_name = "stock_quotes_daily";
const print = createLogger(spider_name, "stock");

export const seedDailyStockQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const task = await initTask("stock_quotes", "eastmoney");

  try {
    print(`start get realtimeStockQuotes`);

    await updateTaskStatus(task.id, "fetching");

    const stocks = await getRealtimeStockQuotes({
      fields: getIndicatorFields(quotesDailyIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    await updateTaskStatus(task.id, "transforming");

    let list = transformStockData(stocks, quotesDailyIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => Number(item.newPrice) > 0);
    // 添加日期

    list = list.map(item => {
      const closePrice = Number(item.newPrice);
      delete item.newPrice;
      return {
        ...item,
        closePrice,
        date: currentDate
      };
    });

    const result = await prisma.stockQuotes.createMany({
      data: list as any,
      skipDuplicates: true
    });

    await updateTaskStatus(task.id, "completed", result.count);

    print(`write realtimeStockQuotes success ${result.count}`);
  } catch (error) {
    await updateTaskStatus(task.id, "failed");
    print(`getRealtimeStockQuotes error: ${error}`);
  }
};

// 清除超过指定天数的数据
export const cleanStockQuotesDaily = async (days: number = 7) => {
  try {
    print(`clean stock quotes daily older than ${days} days`);

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
    print(`clean stock quotes daily error: ${error}`);
  }
};
