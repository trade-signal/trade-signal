import prisma from "@/prisma/db";
import {
  createLogger,
  transformStockData,
  getIndicatorFields
} from "@/cron/util";
import dayjs from "dayjs";
import { updateBatchStatus, initBatch } from "@/cron/common/batch";
import { getRealtimeStockQuotes, quotesDailyIndicatorMapping } from "./api";

const spider_name = "stock_quotes_daily";
const print = createLogger(spider_name, "stock");

export const seedDailyStockQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const batch = await initBatch("stock_quotes_daily", "eastmoney");

  try {
    print(`start get realtimeStockQuotes`);

    await updateBatchStatus(batch.id, "fetching");

    const stocks = await getRealtimeStockQuotes({
      fields: getIndicatorFields(quotesDailyIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    await updateBatchStatus(batch.id, "transforming");

    let list = transformStockData(stocks, quotesDailyIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => Number(item.newPrice) > 0);
    // 添加日期
    list = list.map(item => ({
      ...item,
      closePrice: item.newPrice,
      date: currentDate
    }));

    const result = await prisma.stockQuotesDaily.createMany({
      data: list as any,
      skipDuplicates: true
    });

    await updateBatchStatus(batch.id, "completed", result.count);
    print(`write realtimeStockQuotes success`);
  } catch (error) {
    await updateBatchStatus(batch.id, "failed");
    print(`getRealtimeStockQuotes error: ${error}`);
  }
};
