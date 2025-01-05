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

  const limit = Number(searchParams.get("limit")) || 6;

  const maxDate = await prisma.stockQuotesRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  let where: Prisma.StockQuotesRealTimeWhereInput = {
    date: { equals: maxDate?.date }
  };

  const list = await prisma.stockQuotesRealTime.findMany({
    where,
    skip: 0,
    take: limit,
    orderBy: { newPrice: "desc" }
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
