import { StockIndexQuotes } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export type StockIndexList = {
  code: string;
  name: string;
  latest: StockIndexQuotes;
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const orderBy = searchParams.get("orderBy") || "newPrice";
  const order = searchParams.get("order") || "desc";
  const limit = Number(searchParams.get("limit")) || 5;

  const maxDate = await prisma.stockIndexQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const list = await prisma.stockIndexQuotes.findMany({
    where: {
      date: { equals: maxDate?.date }
    },
    take: limit,
    orderBy: { [orderBy]: order }
  });

  const transformData = list.map(stock => ({
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
