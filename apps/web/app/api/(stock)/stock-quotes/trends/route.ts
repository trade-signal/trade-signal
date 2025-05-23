import { NextRequest } from "next/server";
import prisma from "@/app/utils/prisma";
import { fail, success } from "@/app/utils/response";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) return fail("股票代码不能为空");

  const maxDate = await prisma.stockMinuteKline.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const trends = await prisma.stockMinuteKline.findMany({
    where: {
      code,
      date: { equals: maxDate?.date }
    },
    orderBy: [{ time: "asc" }]
  });

  return success(null, {
    data: trends,
    statistics: {
      date: maxDate?.date
    }
  });
};
