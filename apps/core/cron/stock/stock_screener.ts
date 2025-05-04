import prisma from "@/packages/database/prisma/db";
import { StockScreener } from "@prisma/client";
import dayjs from "dayjs";
import { createLogger, transformStockData } from "@/apps/core/cron/util";
import { getStockScreener, selectionIndicatorMapping } from "../api";

const spider_name = "stock_screener";
const print = createLogger(spider_name);

const getStocks = async (): Promise<Partial<StockScreener>[]> => {
  let page = 1;
  let pageSize = 1000;

  const stocks = [];

  print(`get stocks start`);

  while (true) {
    try {
      const response = await getStockScreener(page, pageSize);

      if (!response.success) {
        throw new Error(
          `get stock screener error: ${response.message || "unknown error"}`
        );
      }

      const { count, data } = response.result;

      const list = transformStockData(data, selectionIndicatorMapping);

      stocks.push(...list);

      if (!count || page * pageSize >= count) break;

      page++;
    } catch (error) {
      print(`get stocks error: ${error}`);
      break;
    }
  }

  print(`get stocks end`);

  return stocks;
};

// 清理历史数据，只保留最新一个交易日数据
export const cleanStockScreener = async () => {
  try {
    print("clean stock screener");
    const lastDate = await prisma.stockScreener.findFirst({
      orderBy: { date: "desc" },
      select: { date: true }
    });

    if (lastDate) {
      const result = await prisma.stockScreener.deleteMany({
        where: { date: { lt: lastDate.date } }
      });
      print(`clean ${result.count} data`);
      return;
    }

    print("no data to clean");
  } catch (error) {
    print(`clean stock screener error: ${error}`);
  }
};

export const fetchStockScreener = async (date?: string) => {
  try {
    if (date) {
      // 删除指定日期及之后的所有数据
      const deleted = await prisma.stockScreener.deleteMany({
        where: {
          date: {
            gte: dayjs(date).format("YYYY-MM-DD")
          }
        }
      });
      print(`delete stock screener: ${deleted.count}`);
    }

    // 获取选股指标
    const stocks = await getStocks();

    if (stocks.length === 0) {
      print(`stock screener is empty`);
      return;
    }

    print(`stock screener count: ${stocks.length}`);

    print(`start write stock screener`);

    const total = stocks.length;

    // 写入选股指标
    while (stocks.length > 0) {
      const list = stocks.splice(0, 1000);

      await prisma.stockScreener.createMany({
        data: list as any,
        skipDuplicates: true
      });
    }

    print(`write stock screener success ${total}`);
  } catch (error) {
    print(`get stock screener error: ${error}`);
  }
};

export const checkStocks = async (date?: string) => {
  const stocks = await prisma.stockScreener.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return stocks.length > 0;
};

export const initStockScreener = async (runDate: string) => {
  const hasStocks = await checkStocks(runDate);

  if (hasStocks) {
    print("stock screener available! No need to fetch.");
    return;
  }

  await fetchStockScreener(runDate);
};
