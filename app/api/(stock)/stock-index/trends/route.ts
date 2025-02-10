import { NextRequest } from "next/server";
import { StockIndexMinuteKline } from "@prisma/client";
import { getStockIndexMinuteByCode } from "@/cron/stock-index/stock_index_minute_kline";
import prisma from "@/prisma/db";

export type StockIndexTrends = {
  code: string;
  name: string;
  trends: StockIndexMinuteKline[];
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

  const maxDate = await prisma.stockIndexQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  await getStockIndexMinuteByCode(code);

  const trends = await prisma.stockIndexMinuteKline.findMany({
    where: {
      code,

      date: { equals: maxDate?.date }
    },
    orderBy: { createdAt: "asc" }
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
