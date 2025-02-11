import { NextRequest } from "next/server";
import { StockMinuteKline } from "@prisma/client";
import prisma from "@/prisma/db";

export type StockQuotesTrends = {
  code: string;
  name: string;
  trends: StockMinuteKline[];
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return Response.json(
      {
        success: false,
        message: "股票代码不能为空"
      },
      { status: 400 }
    );
  }

  const maxDate = await prisma.stockQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const trends = await prisma.stockMinuteKline.findMany({
    where: {
      code,
      date: { equals: maxDate?.date }
    },
    orderBy: [{ createdAt: "asc" }]
  });

  return Response.json({
    success: true,
    data: {
      code,
      name: trends[0]?.name,
      trends
    },
    statistics: {
      date: maxDate?.date
    }
  });
};
