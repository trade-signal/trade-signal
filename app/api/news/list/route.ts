import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/prisma/db";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const tags = searchParams.get("tags");

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  let where: Prisma.NewsWhereInput = {};

  const total = await prisma.news.count({
    where
  });
  if (tags) {
    where.OR = tags.split(",").map(tag => ({
      tags: {
        contains: tag.trim()
      }
    }));
  }

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
