import prisma from "@/prisma/db";
import {
  createLogger,
  transformStockData,
  getIndicatorFields
} from "@/cron/util";
import dayjs from "dayjs";
import Task from "@/cron/common/task";
import { getStockQuotes, quotesDailyIndicatorMapping } from "./api";

const spider_name = "stock_minute_kline";
const print = createLogger(spider_name, "stock");

export const fetchStockMinuteKline = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const task = new Task("stock_minute_kline", "eastmoney");

  try {
    print(`start get realtimeStockQuotes`);

    await task.updateStatus("fetching");

    const stocks = await getStockQuotes({
      fields: getIndicatorFields(quotesDailyIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    await task.updateStatus("transforming");

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

    await task.updateStatus("completed", result.count);

    print(`write stock minute kline success ${result.count}`);
  } catch (error) {
    await task.updateStatus("failed");
    print(`get stock minute kline error: ${error}`);
  }
};

// 清除超过指定天数的数据
export const cleanStockMinuteKline = async (days: number = 7) => {
  try {
    print(`clean stock minute kline older than ${days} days`);

    const tradingDays = await prisma.stockMinuteKline.findMany({
      select: { date: true },
      distinct: ["date"],
      orderBy: { date: "desc" }
    });

    if (tradingDays.length > days) {
      const cutoffDate = tradingDays[days - 1].date;
      const result = await prisma.stockMinuteKline.deleteMany({
        where: { date: { lt: cutoffDate } }
      });

      print(`clean ${result.count} data`);
      return;
    }

    print("no data to clean");
  } catch (error) {
    print(`clean stock minute kline error: ${error}`);
  }
};
