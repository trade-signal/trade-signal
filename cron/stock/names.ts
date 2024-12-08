import { Stock } from "@prisma/client";
import prisma from "@/prisma/db";
import { get } from "@/common/shared/request";
import { parseDate } from "@/common/shared/date";

export type STOCK_TYPE = "sh" | "sz" | "bj";
export type STOCK_SH_SYMBOLS = "主板A股" | "主板B股" | "科创板";
export type STOCK_SZ_SYMBOLS = "A股列表" | "B股列表" | "CDR列表" | "AB股列表";

export const checkStock = async () => {
  const stocks = await prisma.stock.findMany();
  return stocks.length > 0;
};

export const findStocks = async () => {
  return await prisma.stock.findMany();
};

const getShStocks = () => {
  return new Promise(async resolve => {
    const stocks: Partial<Stock>[] = [];
    const set = new Set();

    const symbols: STOCK_SH_SYMBOLS[] = ["主板A股", "主板B股", "科创板"];

    for (const symbol of symbols) {
      const data = await get("/stock_info_sh_name_code", { symbol });

      if (!data) continue;

      data.forEach((item: any) => {
        const {
          证券代码: code,
          证券简称: name,
          公司全称: fullName,
          上市日期: date
        } = item;

        if (!code || set.has(code)) return;

        set.add(code);

        stocks.push({
          type: "sh",
          code,
          name,
          fullName,
          date: parseDate(date),
          symbol
        });
      });
    }

    resolve(stocks);
  });
};

const getSzStocks = () => {
  return new Promise(async resolve => {
    const stocks: Partial<Stock>[] = [];
    const set = new Set();

    const symbols: STOCK_SZ_SYMBOLS[] = [
      "A股列表",
      "B股列表",
      "CDR列表",
      "AB股列表"
    ];

    for (const symbol of symbols) {
      const data = await get("/stock_info_sz_name_code", { symbol });

      if (!data || data.length === 0) continue;

      data.forEach((item: any) => {
        const { A股代码: code, A股简称: name, A股上市日期: date } = item;

        if (!code || set.has(code)) return;

        set.add(code);

        stocks.push({
          type: "sz",
          code,
          name,
          date: parseDate(date),
          symbol
        });
      });
    }

    resolve(stocks);
  });
};

const getBjStocks = () => {
  return new Promise(async resolve => {
    const stocks: Partial<Stock>[] = [];
    const set = new Set();

    const data = await get("/stock_info_bj_name_code", {});

    if (!data || data.length === 0) return resolve(stocks);

    data.forEach((item: any) => {
      const { 证券代码: code, 证券简称: name, 上市日期: date } = item;

      if (!code || set.has(code)) return;

      set.add(code);

      stocks.push({
        type: "bj",
        code,
        name,
        date: parseDate(date),
        symbol: "创业板"
      });
    });

    resolve(stocks);
  });
};

// 抓取股票数据
export const fetchStocks = () =>
  Promise.all([getShStocks(), getSzStocks(), getBjStocks()]) as Promise<
    Partial<Stock>[][]
  >;

// 种子数据
export const seedStocks = async () => {
  try {
    console.log("Seeding stocks...");

    const stocks = await fetchStocks();

    for (const stock of stocks) {
      await prisma.stock.createMany({
        data: stock as any
      });
    }

    console.log("Stocks seeded successfully.");
  } catch (error) {
    console.log("Stocks seeding failed.", error);
  }
};
