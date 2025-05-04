import prisma from "@/packages/database/prisma/db";
import {
  createLogger,
  getIndicatorFields,
  transformStockData
} from "@/apps/core/cron/util";
import { getStockPlateBasic, quotesPlateBaseIndicatorMapping } from "../api";

const spider_name = "stock_plate_base";
const print = createLogger(spider_name, "stock");

export const checkStockPlateBasic = async () => {
  const stocks = await prisma.stockPlateBasic.findMany({});
  return stocks.length > 0;
};

const upsertStockPlateBasic = async (list: any[]) => {
  const stocks = await prisma.stockPlateBasic.findMany({});

  if (stocks.length === 0) {
    await prisma.stockPlateBasic.createMany({
      data: list,
      skipDuplicates: true
    });
    return;
  }

  for (const item of list) {
    await prisma.stockPlateBasic.upsert({
      where: { code: item.code },
      update: { ...item },
      create: { ...item }
    });
  }
};

export const fetchStockPlateBasic = async () => {
  try {
    print(`start get stock plate basic`);

    const stocks = await getStockPlateBasic({
      fields: getIndicatorFields(quotesPlateBaseIndicatorMapping)
    });

    print(`get ${stocks.length} stocks`);

    if (stocks.length === 0) {
      print(`stock plate basic is empty`);
      return;
    }

    const list = transformStockData(stocks, quotesPlateBaseIndicatorMapping);

    print(`start upsert stock plate basic`);

    await upsertStockPlateBasic(list);

    print(`upsert stock plate basic success ${list.length}`);
  } catch (error) {
    print(`fetch stock plate basic error: ${error}`);
  }
};

export const initStockPlateBasic = async () => {
  const hasStockPlateBasic = await checkStockPlateBasic();

  if (hasStockPlateBasic) {
    print("stock plate basic available! No need to fetch.");
    return;
  }

  await fetchStockPlateBasic();
};
