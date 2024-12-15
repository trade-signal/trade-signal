import { type NextRequest } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const industries = searchParams.get("industries");
  const concepts = searchParams.get("concepts");
  const styles = searchParams.get("styles");

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const maxDate = await prisma.stockSelection.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  let where: Prisma.StockSelectionWhereInput = {
    date: { equals: maxDate?.date }
  };

  if (industries) {
    where.industry = {
      in: industries.split(",")
    };
  }

  if (concepts) {
    where.OR = concepts.split(",").map(concept => ({
      concept: {
        contains: concept.trim()
      }
    }));
  }
  if (styles) {
    where.OR = styles.split(",").map(style => ({
      style: {
        contains: style.trim()
      }
    }));
  }

  const data = await prisma.stockSelection.findMany({
    where,
    orderBy: {
      code: "asc"
    },
    skip: offset,
    take: limit
  });

  const total = await prisma.stockSelection.count({
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
