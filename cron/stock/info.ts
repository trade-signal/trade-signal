import { Stock, StockInfo } from "@prisma/client";
import prisma from "@/prisma/db";
import { get } from "@/common/shared/request";
import { findStocks } from "./names";

export const checkStockInfo = async () => {
  const stockInfos = await findStockInfos();
  return stockInfos.length > 0;
};

export const findStockInfos = async () => {
  return await prisma.stockInfo.findMany();
};

export const findStockInfoByCode = async (code: string) => {
  return await prisma.stockInfo.findUnique({
    where: { code }
  });
};

// 抓取股票信息
export const fetchStockInfo = async (
  stock: Stock
): Promise<Partial<StockInfo> | undefined> => {
  const data = await get("/stock_individual_info_em", {
    code: stock.code
  });

  if (!data) return;

  return {
    totalShares: data["总股本"],
    floatShares: data["流通股本"],
    totalMarketValue: data["总市值"],
    floatMarketValue: data["流通市值"],
    industry: data["所属行业"]
  };
};

// 种子数据
export const seedStockInfo = async () => {
  const stocks = await findStocks();

  if (stocks.length === 0) {
    throw new Error("No stocks found. Skipping stock info seeding.");
  }

  console.log("Seeding stock info...");

  try {
    for (const stock of stocks) {
      const data = await fetchStockInfo(stock);

      if (!data) continue;

      await prisma.stockInfo.create({
        data: data as any
      });
    }

    console.log("Stock info seeded successfully.");
  } catch (error) {
    console.log("Stock info seeding failed.", error);
  }
};
