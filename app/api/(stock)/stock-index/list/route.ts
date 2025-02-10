import { StockIndexQuotes } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export type StockIndexQuotesList = {
  code: string;
  name: string;
  stock: StockIndexQuotes;
};

const getOrderList = (list: StockIndexQuotes[], limit: number) => {
  const orderCodes = [
    "000001", // 上证
    "399001", // 深证
    "399006", // 创业板
    "399005", // 中小100
    "000300", // 沪深300
    "000016", // 上证50
    "000688", // 科创50
    "000852" // 中证1000
  ];

  const orderList = [] as StockIndexQuotes[];

  while (orderCodes.length > 0) {
    const code = orderCodes.shift();
    const posIdx = list.findIndex(item => item.code === code);
    if (posIdx !== -1) {
      orderList.push(list[posIdx]);
      list.splice(posIdx, 1);
    }
  }

  orderList.push(...list);

  return orderList.slice(0, limit);
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || 5;

  const maxDate = await prisma.stockIndexQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const list = await prisma.stockIndexQuotes.findMany({
    where: {
      date: { equals: maxDate?.date }
    }
  });

  const orderList = getOrderList(list, limit);

  const transformData = orderList.map(stock => ({
    code: stock.code,
    name: stock.name,
    stock
  }));

  return Response.json({
    success: true,
    data: transformData,
    statistics: {
      date: maxDate?.date
    }
  });
};
