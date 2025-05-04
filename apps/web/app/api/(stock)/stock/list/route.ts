import { type NextRequest } from "next/server";
import prisma from "@/packages/database/prisma/db";
import { MRT_ColumnFiltersState, MRT_SortingState } from "mantine-react-table";
import {
  generateWhereClause,
  generateOrderByClause
} from "@/packages/shared/util";

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

  const where = generateWhereClause(parsedColumnFilters, globalFilter, [
    "code",
    "name"
  ]);
  const orderBy = generateOrderByClause(parsedSorting, "code");

  const data = await prisma.stockBasic.findMany({
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

  const total = await prisma.stockBasic
    .groupBy({
      by: ["code"],
      where,
      _count: true
    })
    .then(result => result.length);

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
