import { NextRequest } from "next/server";
import prisma from "@/app/utils/prisma";
import { StockQuotes, StockPlateQuotes, Prisma } from "@prisma/client";
import { getStockCodePrefixes, MarketType } from "@trade-signal/shared";
import { success } from "@/app/utils/response";

export interface StockTreemap extends StockPlateQuotes {
  children: StockQuotes[];
}

const getStockQuotesMap = (stockQuotes: StockQuotes[]) => {
  return stockQuotes.reduce(
    (acc, stockQuote) => {
      acc[stockQuote.industry] = acc[stockQuote.industry] || [];
      acc[stockQuote.industry].push(stockQuote);
      return acc;
    },
    {} as Record<string, StockQuotes[]>
  );
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const marketType = searchParams.get("marketType") ?? "all";
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

  const where: Prisma.StockQuotesWhereInput = {
    date: { equals: maxDate?.date }
  };

  if (marketType !== "all") {
    const prefixes = getStockCodePrefixes(marketType as MarketType);

    where.OR = prefixes.map(prefix => ({
      code: { startsWith: prefix }
    }));
  }

  const stockQuotes = await prisma.stockQuotes.findMany({
    where,
    orderBy: { [orderBy]: order }
  });
  const stockQuotesMap = getStockQuotesMap(stockQuotes);

  const treemapData = quotes
    .map(quote => ({
      ...quote,
      children: stockQuotesMap[quote.name] || []
    }))
    .filter(item => item.children.length);

  return success(null, {
    data: treemapData,
    statistics: {
      date: maxDate?.date
    }
  });
};
