import prisma from "@/app/utils/prisma";
import { MRT_ColumnFiltersState, MRT_SortingState } from "mantine-react-table";
import { NextRequest } from "next/server";
import { generateWhereClause, generateOrderByClause } from "@/app/utils/tools";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const columnFilters = searchParams.get("columnFilters") ?? "[]";
  const globalFilter = searchParams.get("globalFilter") ?? "";
  const sorting = searchParams.get("sorting") ?? "[]";

  const parsedColumnFilters = JSON.parse(
    columnFilters
  ) as MRT_ColumnFiltersState;

  const parsedSorting = JSON.parse(sorting) as MRT_SortingState;

  const where = generateWhereClause(parsedColumnFilters, globalFilter, [
    "code",
    "name"
  ]);
  const orderBy = generateOrderByClause(parsedSorting, "code");

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const maxDate = await prisma.stockPlateQuotes.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const quotes = await prisma.stockPlateQuotes.findMany({
    where: {
      ...where,
      date: { equals: maxDate?.date }
    },
    orderBy,
    skip: offset,
    take: limit
  });

  const total = await prisma.stockPlateQuotes.count({
    where: {
      ...where,
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
