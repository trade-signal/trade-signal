import { get } from "@/shared/request";
import prisma from "@/prisma/db";
import { createLogger, transformStockData } from "../util";
import dayjs from "dayjs";
import { updateBatchStatus } from "../batch";
import { initBatch } from "../batch";
import { quotesIndicatorMapping } from "./stock_quotes_indicator";

const spider_name = "stock_quotes";
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
      fields:
        "f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f14,f15,f16,f17,f18,f20,f21,f22,f23,f24,f25,f26,f37,f38,f39,f40,f41,f45,f46,f48,f49,f57,f61,f100,f112,f113,f114,f115,f221"
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

// 清除超过7个交易日的数据，避免数据量过大
export const cleanStockQuotes = async () => {
  print("clean stock quotes");

  // 获取最近的股票数据记录，按日期降序排列并去重
  const tradingDays = await prisma.stockQuotesRealTime.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" }
  });

  // 如果有超过7个交易日的数据
  if (tradingDays.length > 7) {
    // 获取第7个交易日的日期作为截止日期
    const cutoffDate = tradingDays[6].date;

    // 删除这个日期之前的所有数据
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

    const stocks = await getRealtimeStockQuotes();

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
    list = list.map(item => ({ ...item, date: currentDate }));

    print(`start write realtimeStockQuotes`);

    await prisma.stockQuotesRealTime.createMany({
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
