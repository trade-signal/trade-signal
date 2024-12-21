import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/prisma/db";
import { getFilteredParams } from "@/shared/util";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const tags = getFilteredParams(searchParams, "tags");

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  let where: Prisma.NewsWhereInput = {};

  if (tags && tags.length) {
    where.tags = { hasEvery: tags };
  }

  const total = await prisma.news.count({
    where
  });

  const data = await prisma.news.findMany({
    where,
    orderBy: {
      date: "desc"
    },
    skip: offset,
    take: limit
  });

  return Response.json({
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize)
    }
  });
};
