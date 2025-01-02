import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/prisma/db";
import { MRT_ColumnFiltersState, MRT_SortingState } from "mantine-react-table";

export const GET = async (request: NextRequest) => {
  const searchParams = new URL(request.url).searchParams;

  const columnFilters = searchParams.get("columnFilters") ?? "[]";
  const globalFilter = searchParams.get("globalFilter") ?? "";
  const sorting = searchParams.get("sorting") ?? "[]";

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const parsedColumnFilters = JSON.parse(
    columnFilters
  ) as MRT_ColumnFiltersState;
  const parsedSorting = JSON.parse(sorting) as MRT_SortingState;

  const maxDate = await prisma.stockQuotesRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  let where: Prisma.StockWhereInput = {};

  if (parsedColumnFilters.length) {
    parsedColumnFilters.forEach(filter => {
      const { id, value } = filter;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          where[id as keyof Prisma.StockOrderByWithRelationInput] = {
            in: value.map(v => v.toString())
          };
        }
      } else if (value) {
        where[id as keyof Prisma.StockOrderByWithRelationInput] = {
          contains: value.toString()
        };
      }
    });
  }

  if (globalFilter) {
    where.OR = [
      { code: { contains: globalFilter } },
      { name: { contains: globalFilter } }
    ];
  }

  let orderBy: Prisma.StockOrderByWithRelationInput = {};
  if (parsedSorting.length) {
    parsedSorting.forEach(sort => {
      const { id, desc } = sort;
      orderBy[id as keyof Prisma.StockOrderByWithRelationInput] = desc
        ? "desc"
        : "asc";
    });
  } else {
    orderBy.code = "asc";
  }

  const data = await prisma.stock.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    distinct: ["code"],
    select: {
      code: true,
      name: true,
      industry: true
    },
    orderBy
  });

  const total = await prisma.stock
    .groupBy({
      by: ["code"],
      where,
      _count: true
    })
    .then(result => result.length);

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
