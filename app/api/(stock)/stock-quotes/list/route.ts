import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const orderBy = searchParams.get("orderBy") || "newPrice";
  const order = searchParams.get("order") || "desc";

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const maxDate = await prisma.stockQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const quotes = await prisma.stockQuotes.findMany({
    where: {
      date: { equals: maxDate?.date }
    },
    skip: offset,
    take: limit,
    orderBy: { [orderBy]: order }
  });

  const total = await prisma.stockQuotes.count({
    where: {
      date: { equals: maxDate?.date }
    }
  });

  return Response.json({
    success: true,
    data: quotes,
    statistics: {
      date: maxDate?.date
    },
    pagination: {
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize)
    }
  });
};
