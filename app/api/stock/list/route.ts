import { type NextRequest } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import {
  StockPriceRange,
  StockMarketValue,
  StockPeRatio
} from "@/app/stock/StockScreenerConfig";

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
const getMarketValueRange = (marketValue: StockMarketValue) => {
  const maps = {
    ">=5000": { gt: 5000 },
    ">=1000 && <=5000": { gt: 1000, lte: 5000 },
    ">=300 && <=1000": { gt: 300, lte: 1000 },
    ">=100 && <=300": { gt: 100, lte: 300 },
    ">=30 && <=100": { gt: 30, lte: 100 },
    ">=10 && <=30": { gt: 10, lte: 30 },
    "<10": { lt: 10 }
  };
  return maps[marketValue];
};
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

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const industries = searchParams.get("industries");
  const concepts = searchParams.get("concepts");
  const styles = searchParams.get("styles");

  const newPrice = searchParams.get("newPrice");
  const totalMarketValue = searchParams.get("totalMarketValue");
  const peRatio = searchParams.get("peRatio");

  const orderBy = searchParams.get("orderBy") || "newPrice";
  const order = searchParams.get("order") || "desc";

  const search = searchParams.get("search");

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
    where.code = {
      contains: search.trim()
    };
  }

  const data = await prisma.stockSelection.findMany({
    where,
    orderBy: {
      [orderBy]: order
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
