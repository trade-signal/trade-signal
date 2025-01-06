import { Prisma } from "@prisma/client";
import prisma from "@/prisma/db";

export const GET = async () => {
  const maxDate = await prisma.stockIndexRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  let where: Prisma.StockIndexRealTimeWhereInput = {
    date: { equals: maxDate?.date }
  };

  const list = await prisma.stockIndexRealTime.findMany({
    where,
    orderBy: { date: "desc" }
  });

  return Response.json({
    success: true,
    data: list,
    statistics: {
      date: maxDate?.date
    }
  });
};
