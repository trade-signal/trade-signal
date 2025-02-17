import { StockPlateQuotes } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export type StockPlateQuotesItem = {
  code: string;
  name: string;
  stock: StockPlateQuotes;
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const orderBy = searchParams.get("orderBy") || "newPrice";
  const order = searchParams.get("order") || "desc";

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const maxDate = await prisma.stockPlateQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const quotes = await prisma.stockPlateQuotes.findMany({
    where: {
      date: { equals: maxDate?.date }
    },
    skip: offset,
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
