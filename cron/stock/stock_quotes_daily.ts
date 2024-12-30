import { get } from "@/shared/request";
import prisma from "@/prisma/db";
import { createLogger, transformStockData } from "../util";
import dayjs from "dayjs";
import { updateBatchStatus } from "../batch";
import { initBatch } from "../batch";
import { quotesDailyIndicatorMapping } from "./stock_quotes_daily_indicator";

const spider_name = "stock_quotes_daily";
const print = createLogger(spider_name, "stock");

/**
 * 沪深京 A 股-实时行情
 *
 * 东方财富网-沪深京 A 股-实时行情
 * https://quote.eastmoney.com/center/gridlist.html#hs_a_board
 *
 */
const getRealtimeStockQuotes = async () => {
  try {
    const url = `http://82.push2.eastmoney.com/api/qt/clist/get`;

    const response = await get(url, {
      pn: "1",
      pz: "50000",
      po: "1",
      np: "1",
      ut: "bd1d9ddb04089700cf9c27f6f7426281",
      fltt: "2",
      invt: "2",
      fid: "f3",
      fs: "m:0 t:6,m:0 t:80,m:1 t:2,m:1 t:23,m:0 t:81 s:2048",
      fields: "f12,f14,f15,f16,f17,f18,f5,f6"
    });

    if (response.data && response.data.diff) {
      return response.data.diff;
    }

    throw new Error(
      `getRealtimeStockQuotes error: ${response.message || "unknown error"}`
    );
  } catch (error) {
    print(`getRealtimeStockQuotes error: ${error}`);
    return [];
  }
};

export const seedDailyStockQuotes = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const batch = await initBatch("stock_quotes_daily", "eastmoney");

  try {
    print(`start get realtimeStockQuotes`);

    await updateBatchStatus(batch.id, "fetching");

    const stocks = await getRealtimeStockQuotes();

    print(`get ${stocks.length} stocks`);

    await updateBatchStatus(batch.id, "transforming");

    let list = transformStockData(stocks, quotesDailyIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => Number(item.newPrice) > 0);
    // 添加日期
    list = list.map(item => ({ ...item, date: currentDate }));

    await prisma.stockQuotesDaily.createMany({
      data: list as any,
      skipDuplicates: true
    });

    await updateBatchStatus(batch.id, "completed", list.length);
    print(`write realtimeStockQuotes success`);
  } catch (error) {
    await updateBatchStatus(batch.id, "failed");
    print(`getRealtimeStockQuotes error: ${error}`);
  }
};
