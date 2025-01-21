import { Prisma, StockQuotesRealTime } from "@prisma/client";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const orderBy = searchParams.get("orderBy") || "newPrice";
  const order = searchParams.get("order") || "desc";

  const limit = Number(searchParams.get("limit")) || 6;

  const maxDate = await prisma.stockQuotesLatest.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const list = await prisma.stockQuotesLatest.findMany({
    where: { date: maxDate?.date },
    take: limit,
    orderBy: [{ [orderBy]: order }]
  });

  return Response.json({
    success: true,
    data: list,
    statistics: {
      date: maxDate?.date
    }
  });
};
