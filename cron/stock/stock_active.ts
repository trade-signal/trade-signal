import prisma from "@/prisma/db";
import { createLogger } from "@/cron/util";
import { StockBasic } from "@prisma/client";

const print = createLogger("stock_active", "stock");

// update stock active
export const updateActiveStock = async (
  code: string,
  name: string,
  marketId: number
) => {
  try {
    await prisma.stockActive.upsert({
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
    print(`Update active stock error: ${error}`);
  }
};

// batch update stock active
export const batchUpdateActiveStock = async (stocks: StockBasic[]) => {
  while (stocks.length > 0) {
    const batch = stocks.splice(0, 100);

    await Promise.all(
      batch.map(stock =>
        updateActiveStock(stock.code, stock.name, stock.marketId)
      )
    );

    print(`upsert ${batch.length} stocks, left ${stocks.length}`);
  }
};

// get stock active
export const getActiveStocks = async (limit: number = 100) => {
  return await prisma.stockActive.findMany({
    orderBy: { lastViewAt: "desc" },
    take: limit
  });
};

// clean expired stock active (keep the latest N records)
export const cleanActiveStocks = async (keepCount: number = 100) => {
  try {
    const stocks = await prisma.stockActive.findMany({
      orderBy: { lastViewAt: "desc" },
      skip: keepCount
    });

    if (stocks.length > 0) {
      await prisma.stockActive.deleteMany({
        where: {
          code: {
            in: stocks.map(s => s.code)
          }
        }
      });
      print(`Cleaned ${stocks.length} inactive stocks`);
    }
  } catch (error) {
    print(`Clean active stocks error: ${error}`);
  }
};

// check stock active
export const checkActiveStocks = async () => {
  const stocks = await prisma.stockActive.findMany();
  return stocks.length > 0;
};

// get pre active stocks
const getPreActiveStocks = async () => {
  const maxDate = await prisma.stockQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const quotes = await prisma.stockQuotes.findMany({
    where: {
      date: { equals: maxDate?.date }
    },
    take: 10,
    orderBy: { newPrice: "desc" }
  });

  const stocks = await Promise.all(
    quotes.map(async stock => {
      const stockBasic = await prisma.stockBasic.findFirst({
        where: { code: stock.code }
      });
      return stockBasic;
    })
  );

  return stocks.filter(stock => stock !== null);
};

// init stock active
export const initActiveStocks = async () => {
  const hasActiveStocks = await checkActiveStocks();

  if (hasActiveStocks) {
    print("stock active available! No need to fetch.");
    return;
  }

  const stocks = await getPreActiveStocks();
  await batchUpdateActiveStock(stocks);
};
