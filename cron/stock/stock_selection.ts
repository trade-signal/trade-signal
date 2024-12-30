import { get } from "@/shared/request";
import prisma from "@/prisma/db";
import { StockSelection } from "@prisma/client";
import dayjs from "dayjs";
import { initBatch, updateBatchStatus } from "../batch";
import { selectionIndicatorMapping } from "./stock_selection_indicator";
import { createLogger, transformStockData } from "../util";

const spider_name = "stock_selection";
const print = createLogger(spider_name);

/**
 * 选股指标
 *
 * 东方财富网-个股-选股器
 * https://data.eastmoney.com/xuangu/
 *
 * @param page 页码
 * @param pageSize 每页数量
 */
const getStockSelection = async (page: number, pageSize: number) => {
  try {
    const url = `https://data.eastmoney.com/dataapi/xuangu/list`;

    // 选股指标 初始值 "SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,CHANGE_RATE"
    const sty = Object.values(selectionIndicatorMapping)
      .map(item => item.map)
      .join(",");

    // 过滤条件
    // const filter = `(MARKET+in+("上交所主板","深交所主板","深交所创业板","上交所科创板","上交所风险警示板","深交所风险警示板","北京证券交易所"))(NEW_PRICE>0)`;
    const filter = `(MARKET+in+("上交所主板","深交所主板","深交所创业板","上交所科创板"))(NEW_PRICE>0)`;

    const response = await get(url, {
      sty,
      filter: filter,
      p: page,
      ps: pageSize,
      source: "SELECT_SECURITIES",
      client: "WEB"
    });

    return response;
  } catch (error) {
    print(`getStockSelection error: ${error}`);
    return [];
  }
};

const getStocks = async (): Promise<Partial<StockSelection>[]> => {
  let page = 1;
  let pageSize = 1000;

  const stocks = [];

  print(`getStocks start`);

  while (true) {
    try {
      const response = await getStockSelection(page, pageSize);

      if (!response.success) {
        throw new Error(
          `getStockSelection error: ${response.message || "unknown error"}`
        );
      }

      const { count, data } = response.result;

      const list = transformStockData(data, selectionIndicatorMapping);

      stocks.push(...list);

      if (!count || page * pageSize >= count) break;

      page++;
    } catch (error) {
      print(`getStocks error: ${error}`);
      break;
    }
  }

  print(`getStocks end`);

  return stocks;
};

// 清理历史数据，只保留最新一个交易日数据
export const cleanStockSelection = async () => {
  const lastDate = await prisma.stockSelection.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });
  if (lastDate) {
    await prisma.stockSelection.deleteMany({
      where: { date: { lt: lastDate.date } }
    });
  }
};

export const seedStockSelection = async (date?: string) => {
  const batch = await initBatch("stock_selection", "eastmoney");

  try {
    if (date) {
      // 删除指定日期及之后的所有数据
      const deleted = await prisma.stockSelection.deleteMany({
        where: {
          date: {
            gte: dayjs(date).format("YYYY-MM-DD")
          }
        }
      });
      print(`deleteStockSelection: ${deleted.count}`);
    }

    await updateBatchStatus(batch.id, "fetching");

    // 获取选股指标
    const stocks = await getStocks();

    if (stocks.length === 0) {
      print(`stockSelection is empty`);
      return;
    }

    print(`stockSelection count: ${stocks.length}`);
    await updateBatchStatus(batch.id, "transforming");

    print(`start write stockSelection`);

    const total = stocks.length;

    // 写入选股指标
    while (stocks.length > 0) {
      const list = stocks.splice(0, 1000);

      await prisma.stockSelection.createMany({
        data: list as any,
        skipDuplicates: true
      });
    }

    await updateBatchStatus(batch.id, "completed", total);

    print(`write stockSelection success`);
  } catch (error) {
    await updateBatchStatus(batch.id, "failed");
    print(`getStockSelection error: ${error}`);
  }
};

export const checkStocks = async (date?: string) => {
  const stocks = await prisma.stockSelection.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return stocks.length > 0;
};

export const initStockSelectionData = async (runDate: string) => {
  const hasStocks = await checkStocks(runDate);

  if (hasStocks) {
    print("stockSelection available! No need to seed.");
    return;
  }

  await seedStockSelection(runDate);
};
