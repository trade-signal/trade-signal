import { get } from "@/shared/request";
import prisma from "@/prisma/db";
import { createLogger } from "../util";
import dayjs from "dayjs";
import { updateBatchStatus } from "../batch";
import { initBatch } from "../batch";

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
      `获取 A 股-实时行情失败: ${response.message || "未知错误"}`
    );
  } catch (error) {
    print(`获取 A 股-实时行情失败: ${error}`);
    return [];
  }
};

export const checkStockQuotes = async (date?: string) => {
  const quotes = await prisma.stockQuotesRealTime.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return quotes.length > 0;
};

const transformStockQuotes = async (stocks: any[]) => {
  const list = stocks.map(item => ({
    ...item
  }));

  return list;
};

export const seedStockQuotes = async (date?: string) => {
  const batch = await initBatch("stock_quotes", "eastmoney");

  try {
    await updateBatchStatus(batch.id, "fetching");

    const stocks = await getRealtimeStockQuotes();

    if (stocks.length === 0) {
      print(`A 股-实时行情为空`);
      return;
    }

    await updateBatchStatus(batch.id, "transforming");

    print(`开始写入 A 股-实时行情`);
  } catch (error) {
    print(`获取 A 股-实时行情失败: ${error}`);
  }
};
