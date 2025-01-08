import { Prisma, StockQuotesRealTime } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export type StockQuotesOrder = {
  code: string;
  name: string;
  latest: StockQuotesRealTime;
  trends: StockQuotesRealTime[];
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const limit = Number(searchParams.get("limit")) || 5;

  const maxDate = await prisma.stockQuotesRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const codes = await prisma.stockSelection.findMany({
    select: { code: true },
    distinct: ["code"],
    take: limit,
    orderBy: { newPrice: "desc" }
  });

  let where: Prisma.StockQuotesRealTimeWhereInput = {
    code: { in: codes.map(item => item.code) },
    date: { equals: maxDate?.date }
  };

  const list = await prisma.stockQuotesRealTime.findMany({
    where,
    orderBy: [{ code: "asc" }, { createdAt: "asc" }]
  });

  const groupData = list.reduce((acc, item) => {
    if (!acc.has(item.code)) {
      acc.set(item.code, []);
    }
    acc.get(item.code)?.push(item);
    return acc;
  }, new Map<string, StockQuotesRealTime[]>());

  const transformData = Array.from(groupData.entries()).map(
    ([code, trends]) => {
      const latest = trends.at(-1);
      return {
        code,
        name: latest?.name,
        latest,
        trends
      };
    }
  );

  return Response.json({
    success: true,
    data: transformData,
    statistics: {
      date: maxDate?.date
    }
  });
};
