import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/prisma/db";
import { parseCommaSeparatedParam } from "@/shared/util";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const industries = parseCommaSeparatedParam(searchParams, "industries");
  const fields = parseCommaSeparatedParam(searchParams, "fields");

  const search = searchParams.get("search")?.trim();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const maxDate = await prisma.stockQuotesRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  let where: Prisma.StockQuotesRealTimeWhereInput = {
    date: { equals: maxDate?.date }
  };

  if (industries && industries.length) {
    where.industry = { in: industries };
  }

  if (search) {
    where.OR = [{ code: { contains: search } }, { name: { contains: search } }];
  }

  const data = await prisma.stockQuotesRealTime.findMany({
    where,
    skip: offset,
    take: limit,
    select: {
      code: true,
      name: true,
      ...(fields.length
        ? fields.reduce((acc, field) => {
            acc[field] = true;
            return acc;
          }, {})
        : {})
    },
    orderBy: { code: "asc" }
  });

  const total = await prisma.stockQuotesRealTime.count({
    where
  });

  return Response.json({
    success: true,
    data,
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
