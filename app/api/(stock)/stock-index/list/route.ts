import { Prisma, StockIndexRealTime } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";
import { mockStockIndexRealTimeData } from "./data";

export type StockIndexOrder = {
  code: string;
  name: string;
  latest: StockIndexRealTime;
  trends: StockIndexRealTime[];
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const limit = Number(searchParams.get("limit")) || 12;

  const maxDate = await prisma.stockIndexRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  let where: Prisma.StockIndexRealTimeWhereInput = {
    date: { equals: maxDate?.date }
  };

  const list = await prisma.stockIndexRealTime.findMany({
    where,
    orderBy: { createdAt: "asc" }
  });

  const groupData = list.reduce((acc, item) => {
    if (!acc.has(item.code)) {
      acc.set(item.code, []);
    }
    acc.get(item.code)?.push(item);
    return acc;
  }, new Map<string, StockIndexRealTime[]>());

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
  const otherCodes = [
    ...new Set(
      list.map(item => item.code).filter(code => !orderCodes.includes(code))
    )
  ];

  // const orderData = [...orderCodes, ...otherCodes].slice(0, limit).map(code => {
  //   const data = groupData.get(code);
  //   const latest = data?.at(-1);

  //   return {
  //     code,
  //     name: latest?.name,
  //     newPrice: latest?.newPrice,
  //     changeRate: latest?.changeRate,
  //     upsDowns: latest?.upsDowns,
  //     preClosePrice: latest?.preClosePrice,
  //     trends: data
  //   };
  // });

  // 构造一份当天的假数据

  const orderData = [
    {
      code: "000001",
      name: "上证指数",
      latest: mockStockIndexRealTimeData.at(-1),
      trends: mockStockIndexRealTimeData
    }
  ];

  return Response.json({
    success: true,
    data: orderData,
    statistics: {
      date: maxDate?.date
    }
  });
};
