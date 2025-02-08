import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/prisma/db";
import {
  StockPriceRange,
  StockMarketValue,
  StockPeRatio
} from "@/app/(pages)/stock/StockScreenerConfig";
import { parseCommaSeparatedParam } from "@/shared/util";

// 价格范围
const getPriceRange = (price: StockPriceRange) => {
  const maps = {
    ">=200": { gt: 200 },
    ">=100 && <=300": { gt: 100, lte: 300 },
    ">=50 && <=100": { gt: 50, lte: 100 },
    ">=20 && <=50": { gt: 20, lte: 50 },
    ">=10 && <=20": { gt: 10, lte: 20 },
    ">=5 && <=10": { gt: 5, lte: 10 },
    "<5": { lt: 5 }
  };
  return maps[price];
};

// 市值范围
const getMarketValueRange = (marketValue: StockMarketValue) => {
  const maps = {
    ">=5000": { gt: 5000 * 100000000 },
    ">=1000 && <=5000": { gt: 1000 * 100000000, lte: 5000 * 100000000 },
    ">=300 && <=1000": { gt: 300 * 100000000, lte: 1000 * 100000000 },
    ">=100 && <=300": { gt: 100 * 100000000, lte: 300 * 100000000 },
    ">=30 && <=100": { gt: 30 * 100000000, lte: 100 * 100000000 },
    ">=10 && <=30": { gt: 10 * 100000000, lte: 30 * 100000000 },
    "<10": { lt: 10 }
  };
  return maps[marketValue];
};

// 市盈率范围
const getPeRatioRange = (peRatio: StockPeRatio) => {
  const maps = {
    ">100": { gt: 100 },
    ">=50 && <=100": { gt: 50, lte: 100 },
    ">=30 && <=50": { gt: 30, lte: 50 },
    ">=15 && <=30": { gt: 15, lte: 30 },
    ">=10 && <=15": { gt: 10, lte: 15 },
    "<10": { lt: 10 },
    "<0": { lt: 0 }
  };
  return maps[peRatio];
};

const generateWhereOR = (params: string[], field: string) => {
  return params.map(param => ({
    [field]: {
      contains: param.trim()
    }
  }));
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const industries = parseCommaSeparatedParam(searchParams, "industries");
  const concepts = parseCommaSeparatedParam(searchParams, "concepts");
  const styles = parseCommaSeparatedParam(searchParams, "styles");

  const newPrice = searchParams.get("newPrice");
  const totalMarketValue = searchParams.get("totalMarketValue");
  const peRatio = searchParams.get("peRatio");

  const orderBy = searchParams.get("orderBy") || "newPrice";
  const order = searchParams.get("order") || "desc";

  const search = searchParams.get("search")?.trim();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const maxDate = await prisma.stockScreener.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  let where: Prisma.StockScreenerWhereInput = {
    date: { equals: maxDate?.date }
  };

  if (industries && industries.length) {
    where.industry = {
      in: industries
    };
  }

  let whereOR: Prisma.StockScreenerWhereInput[] = [];

  if (concepts && concepts.length) {
    whereOR.push(...generateWhereOR(concepts, "concept"));
  }
  if (styles && styles.length) {
    whereOR.push(...generateWhereOR(styles, "style"));
  }
  if (whereOR.length > 0) {
    where.OR = whereOR;
  }

  if (newPrice) {
    where.newPrice = getPriceRange(newPrice as StockPriceRange);
  }
  if (totalMarketValue) {
    where.totalMarketCap = getMarketValueRange(
      totalMarketValue as StockMarketValue
    );
  }
  if (peRatio) {
    where.pe9 = getPeRatioRange(peRatio as StockPeRatio);
  }

  if (search) {
    // use search to filter code and name
    where.OR = [{ code: { contains: search } }, { name: { contains: search } }];
  }

  const data = await prisma.stockScreener.findMany({
    where,
    orderBy: {
      [orderBy]: order
    },
    skip: offset,
    take: limit
  });

  const total = await prisma.stockScreener.count({
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
