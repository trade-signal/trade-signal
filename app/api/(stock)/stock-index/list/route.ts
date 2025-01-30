import { StockIndexRealTime } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export type StockIndexOrder = {
  code: string;
  name: string;
  latest: StockIndexRealTime;
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || 5;

  const maxDate = await prisma.stockIndexRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

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
  const targetCodes = [...orderCodes.slice(0, limit)];

  const list = await prisma.stockIndexRealTime.findMany({
    where: {
      code: { in: targetCodes },
      date: { equals: maxDate?.date }
    },
    orderBy: { code: "asc" }
  });

  const orderData = targetCodes.map(code => {
    const latest = list.find(item => item.code === code);
    return {
      code,
      name: latest?.name,
      latest
    };
  });

  return Response.json({
    success: true,
    data: orderData,
    statistics: {
      date: maxDate?.date
    }
  });
};
