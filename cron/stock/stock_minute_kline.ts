import { StockBasic } from "@prisma/client";
import prisma from "@/prisma/db";
import { createLogger } from "@/cron/util";
import dayjs from "dayjs";
import Task from "@/cron/common/task";
import { getStockMinuteKline, quotesMinuteIndicatorMapping } from "./api";
import { delay } from "@/shared/util";

const spider_name = "stock_minute_kline";
const print = createLogger(spider_name, "stock");

const transformStockMinuteKline = (klines: any[]) => {
  return klines.map(item => {
    const [
      time,
      openPrice,
      closePrice,
      highPrice,
      lowPrice,
      volume,
      amount,
      newPrice
    ] = item.split(",");
    return {
      date: dayjs(time).format("YYYY-MM-DD"),
      time: dayjs(time).format("HH:mm:ss"),
      openPrice: parseFloat(openPrice),
      highPrice: parseFloat(highPrice),
      lowPrice: parseFloat(lowPrice),
      closePrice: parseFloat(closePrice),
      volume: parseFloat(volume),
      amount: parseFloat(amount),
      newPrice: parseFloat(newPrice)
    };
  });
};

const getStockMinute = async (stock: StockBasic) => {
  const { code, marketId } = stock;

  const klines = await getStockMinuteKline(marketId, code);

  if (klines.length === 0) throw new Error(`no data for ${code}`);

  const list = transformStockMinuteKline(klines);
  const data = list.map(item => ({ code, period: 1, ...item }));

  const result = await prisma.stockMinuteKline.createMany({
    data: data as any,
    skipDuplicates: true
  });

  return result;
};

export const fetchStockMinuteKline = async () => {
  const task = new Task("stock_minute_kline", "eastmoney");

  const stocks = await prisma.stockBasic.findMany({});

  try {
    await task.updateStatus("fetching");

    print(`fetching ${stocks.length} stocks`);

    while (stocks.length) {
      const batchStocks = stocks.splice(0, 100);

      try {
        print(`start upsert ${batchStocks.length} stocks`);

        await Promise.all(
          batchStocks.map(
            stock =>
              new Promise(async (resolve, reject) => {
                let retries = 3;

                while (retries > 0) {
                  try {
                    await getStockMinute(stock);
                    await delay(300);
                    resolve(true);
                    break;
                  } catch (error) {
                    retries--;
                    if (retries === 0) {
                      print(`get ${stock.code} error: ${error}`);
                      reject(error);
                    } else {
                      print(
                        `get ${stock.code} error: ${error}, retry ${retries} times`
                      );
                      await delay(1000);
                    }
                  }
                }
              })
          )
        );

        print(
          `upsert ${batchStocks.length} stocks success, remaining ${stocks.length}`
        );
      } catch (error) {
        print(`get stock minute kline error: ${error}`);
        stocks.push(...batchStocks);

        await delay(5 * 1000);

        print(`retry ${batchStocks.length} stocks`);
      }
    }

    print("fetch all stocks success");

    await task.updateStatus("completed", stocks.length);
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
