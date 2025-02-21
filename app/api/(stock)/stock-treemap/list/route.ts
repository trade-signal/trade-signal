import { NextRequest } from "next/server";
import prisma from "@/prisma/db";
import { StockQuotes, StockPlateQuotes } from "@prisma/client";

export interface StockTreemap extends StockPlateQuotes {
  children: StockQuotes[];
}

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const orderBy = searchParams.get("orderBy") ?? "changeRate";
  const order = searchParams.get("order") ?? "desc";

  const maxDate = await prisma.stockPlateQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const quotes = await prisma.stockPlateQuotes.findMany({
    where: {
      date: { equals: maxDate?.date }
    },
    orderBy: { [orderBy]: order }
  });

  const stockQuotes = await prisma.stockQuotes.findMany({
    where: {
      date: { equals: maxDate?.date }
    },
    orderBy: { [orderBy]: order }
  });
  const stockQuotesMap = stockQuotes.reduce((acc, stock) => {
    acc[stock.industry] = acc[stock.industry] || [];
    acc[stock.industry].push(stock);
    return acc;
  }, {} as Record<string, StockQuotes[]>);

  const treemapData = quotes.map(quote => ({
    ...quote,
    children: stockQuotesMap[quote.name] || []
  }));

  return Response.json({
    success: true,
    data: treemapData,
    statistics: {
      date: maxDate?.date
    }
  });
};
