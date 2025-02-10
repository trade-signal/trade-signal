import { StockIndexBasic } from "@prisma/client";
import prisma from "@/prisma/db";
import { createLogger } from "@/cron/util";
import dayjs from "dayjs";
import Task from "@/cron/common/task";
import { getStockIndexMinuteKline } from "../api";
import { delay } from "@/shared/util";

const spider_name = "stock_index_minute_kline";
const print = createLogger(spider_name, "stock");

const transformStockIndexMinuteKline = (klines: any[]) => {
  return klines.map(item => {
    // 2025-02-07 09:30,3269.23,3269.23,3269.23,3269.23,3272.251
    const [time, openPrice, closePrice, highPrice, lowPrice, newPrice] =
      item.split(",");
    return {
      date: dayjs(time).format("YYYY-MM-DD"),
      time: dayjs(time).format("HH:mm:ss"),
      openPrice: parseFloat(openPrice),
      highPrice: parseFloat(highPrice),
      lowPrice: parseFloat(lowPrice),
      closePrice: parseFloat(closePrice),
      newPrice: parseFloat(newPrice)
    };
  });
};

export const getStockIndexMinute = async (stock: StockIndexBasic) => {
  const { marketId, code, name } = stock;

  const klines = await getStockIndexMinuteKline(marketId, code);

  if (klines.length === 0) return [];

  const list = transformStockIndexMinuteKline(klines);
  const data = list.map(item => ({ code, name, period: 1, ...item }));

  const result = await prisma.stockIndexMinuteKline.createMany({
    data: data as any,
    skipDuplicates: true
  });

  return result;
};

export const getStockIndexMinuteByCode = async (code: string) => {
  const stock = await prisma.stockIndexBasic.findFirst({
    where: { code }
  });
  if (stock) await getStockIndexMinute(stock);
};

// @deprecated
const fetchStockIndexMinuteKline = async () => {
  const task = new Task("stock_index_minute_kline", "eastmoney");

  const stocks = await prisma.stockIndexBasic.findMany({});

  try {
    await task.updateStatus("fetching");

    print(`fetching ${stocks.length} index stocks`);

    while (stocks.length) {
      const batchStocks = stocks.splice(0, 10);

      try {
        print(`start upsert ${batchStocks.length} index stocks`);

        await Promise.all(
          batchStocks.map(
            stock =>
              new Promise(async (resolve, reject) => {
                let retries = 3;

                while (retries > 0) {
                  try {
                    await getStockIndexMinute(stock);
                    await delay(300);
                    resolve(true);
                    break;
                  } catch (error) {
                    retries--;
                    if (retries === 0) {
                      print(`get ${stock.code} index error: ${error}`);
                      reject(error);
                    } else {
                      print(
                        `get ${stock.code} index error: ${error}, retry ${retries} times`
                      );
                      await delay(1000);
                    }
                  }
                }
              })
          )
        );

        print(
          `upsert ${batchStocks.length} index stocks success, remaining ${stocks.length}`
        );

        await delay(1000);
      } catch (error) {
        print(`get index minute kline error: ${error}`);
        stocks.push(...batchStocks);

        await delay(5 * 1000);

        print(`retry ${batchStocks.length} index stocks`);
      }
    }

    print("fetch all index stocks success");

    await task.updateStatus("completed", stocks.length);
  } catch (error) {
    await task.updateStatus("failed");
    print(`get index minute kline error: ${error}`);
  }
};

// 清除超过指定天数的数据
export const cleanStockIndexMinuteKline = async (days: number = 7) => {
  try {
    print(`clean index minute kline older than ${days} days`);

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

      print(`clean ${result.count} index minute kline data`);
      return;
    }

    print("no index minute kline data to clean");
  } catch (error) {
    print(`clean index minute kline error: ${error}`);
  }
};
