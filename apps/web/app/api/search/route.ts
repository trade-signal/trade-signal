import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/app/utils/prisma";
import { fail, success } from "@/app/utils/response";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get("keyword")?.trim();

  const maxDate = await prisma.stockScreener.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const where: Prisma.StockScreenerWhereInput = {
    date: { equals: maxDate?.date },
    OR: [{ code: { contains: keyword } }, { name: { contains: keyword } }]
  };

  const results = await prisma.stockScreener.findMany({
    where,
    take: 10,
    select: {
      code: true,
      name: true,
      industry: true,
      concept: true,
      style: true,
      date: true
    }
  });

  return success(null, { data: results });
};
