import { get } from "@/shared/request";
import prisma from "@/prisma/db";
import { createLogger, transformStockData } from "../util";
import dayjs from "dayjs";
import { updateBatchStatus } from "../batch";
import { initBatch } from "../batch";
import { stockBaseIndicatorMapping } from "./stock_base_indicator";

const spider_name = "stock_base";
const print = createLogger(spider_name, "stock");

/**
 * 沪深京 A 股-实时行情
 *
 * 东方财富网-沪深京 A 股-实时行情
 * https://quote.eastmoney.com/center/gridlist.html#hs_a_board
 *
 */
const getStockBase = async () => {
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
      fields: "f12,f14,f2,f100,f26"
    });

    if (response.data && response.data.diff) {
      return response.data.diff;
    }

    throw new Error(
      `getStockBase error: ${response.message || "unknown error"}`
    );
  } catch (error) {
    print(`getStockBase error: ${error}`);
    return [];
  }
};

export const checkStockBase = async () => {
  const stocks = await prisma.stock.findMany({});
  return stocks.length > 0;
};

export const seedStockBase = async (date?: string) => {
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const batch = await initBatch("stock_base", "eastmoney");

  try {
    print(`start get stock base`);

    await updateBatchStatus(batch.id, "fetching");

    const stocks = await getStockBase();

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock base is empty`);
      return;
    }

    await updateBatchStatus(batch.id, "transforming");

    let list = transformStockData(stocks, stockBaseIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => item.newPrice > 0);

    print(`start write stock base`);

    await prisma.stock.createMany({
      data: list.map(item => {
        const { newPrice, ...rest } = item;
        return {
          ...rest,
          status: newPrice > 0 ? "active" : "suspended"
        };
      }),
      skipDuplicates: true
    });

    await updateBatchStatus(batch.id, "completed", list.length);
    print(`write stock base success`);
  } catch (error) {
    await updateBatchStatus(batch.id, "failed");
    print(`getStockBase error: ${error}`);
  }
};

export const initStockBaseData = async () => {
  const hasStockBase = await checkStockBase();

  if (hasStockBase) {
    print("stock base available! No need to seed.");
    return;
  }

  await seedStockBase();
};
