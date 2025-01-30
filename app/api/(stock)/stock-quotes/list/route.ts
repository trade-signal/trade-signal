import { StockQuotesRealTime } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export type StockQuotesList = {
  code: string;
  name: string;
  latest: StockQuotesRealTime;
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const orderBy = searchParams.get("orderBy") || "newPrice";
  const order = searchParams.get("order") || "desc";
  const limit = Number(searchParams.get("limit")) || 5;

  const maxDate = await prisma.stockQuotesRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const codes = await prisma.stockSelection.findMany({
    select: { code: true },
    distinct: ["code"],
    take: limit,
    orderBy: { [orderBy]: order }
  });

  const latestData = await prisma.stockQuotesRealTime.findMany({
    where: {
      code: { in: codes.map(item => item.code) },
      date: { equals: maxDate?.date }
    },
    orderBy: [{ code: "asc" }, { createdAt: "desc" }],
    distinct: ["code"]
  });

  const transformData = latestData.map(stock => ({
    code: stock.code,
    name: stock.name,
    latest: stock
  }));

  return Response.json({
    success: true,
    data: transformData,
    statistics: {
      date: maxDate?.date
    }
  });
};
