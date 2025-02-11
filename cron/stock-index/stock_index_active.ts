import prisma from "@/prisma/db";
import { createLogger } from "@/cron/util";
import { StockIndexBasic } from "@prisma/client";

const print = createLogger("stock_index_active", "stock");

// update stock active
export const updateActiveStockIndex = async (stock: StockIndexBasic) => {
  try {
    const { code, name, marketId } = stock;

    await prisma.stockIndexActive.upsert({
      where: { code },
      create: {
        code,
        name,
        marketId,
        lastViewAt: new Date()
      },
      update: {
        lastViewAt: new Date()
      }
    });
  } catch (error) {
    print(`Update active stock index error: ${error}`);
  }
};

// batch update stock active
export const batchUpdateActiveStockIndex = async (
  stocks: StockIndexBasic[]
) => {
  while (stocks.length > 0) {
    const batch = stocks.splice(0, 100);

    await Promise.all(batch.map(stock => updateActiveStockIndex(stock)));

    print(`upsert ${batch.length} stocks, left ${stocks.length}`);
  }
};

// get stock active
export const getActiveStocksIndex = async (limit: number = 100) => {
  return await prisma.stockIndexActive.findMany({
    orderBy: { lastViewAt: "desc" },
    take: limit
  });
};

// clean expired stock active (keep the latest N records)
export const cleanActiveStocksIndex = async (keepCount: number = 100) => {
  try {
    const stocks = await prisma.stockIndexActive.findMany({
      orderBy: { lastViewAt: "desc" },
      skip: keepCount
    });

    if (stocks.length > 0) {
      await prisma.stockIndexActive.deleteMany({
        where: {
          code: {
            in: stocks.map(s => s.code)
          }
        }
      });
      print(`Cleaned ${stocks.length} inactive stocks`);
    }
  } catch (error) {
    print(`Clean active stocks index error: ${error}`);
  }
};

// check stock active
export const checkActiveStockIndex = async () => {
  const stocks = await prisma.stockIndexActive.findMany();
  return stocks.length > 0;
};

// get pre active stocks
const getPreActiveStocks = async () => {
  const codes = [
    "000001", // 上证
    "399001", // 深证
    "399006", // 创业板
    "399005", // 中小100
    "000300", // 沪深300
    "000016", // 上证50
    "000688", // 科创50
    "000852" // 中证1000
  ];

  const stocks = await Promise.all(
    codes.map(async code => {
      const stockBasic = await prisma.stockIndexBasic.findFirst({
        where: { code }
      });
      return stockBasic;
    })
  );

  return stocks.filter(stock => stock !== null);
};

// init stock active
export const initActiveStockIndex = async () => {
  const hasActiveStocks = await checkActiveStockIndex();

  if (hasActiveStocks) {
    print("stock active available! No need to fetch.");
    return;
  }

  const stocks = await getPreActiveStocks();
  await batchUpdateActiveStockIndex(stocks);
};
