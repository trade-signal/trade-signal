import { StockQuotes } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export type StockQuotesList = {
  code: string;
  name: string;
  stock: StockQuotes;
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const orderBy = searchParams.get("orderBy") || "newPrice";
  const order = searchParams.get("order") || "desc";
  const limit = Number(searchParams.get("limit")) || 5;

  const maxDate = await prisma.stockQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const quotes = await prisma.stockQuotes.findMany({
    where: {
      date: { equals: maxDate?.date }
    },
    take: limit,
    orderBy: { [orderBy]: order }
  });

  const transformData = quotes.map(stock => ({
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
