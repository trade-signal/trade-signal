import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma/db";
import { Watch, Watchlist, StockQuotesRealTime } from "@prisma/client";

export type WatchStock = Watch & {
  quote: StockQuotesRealTime;
};

export type WatchlistWithStocks = Watchlist & {
  stocks: WatchStock[];
};

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      success: false,
      message: "Unauthorized"
    });
  }

  const userId = session.user.id;
  if (!userId) {
    return Response.json({
      success: false,
      message: "Unauthorized"
    });
  }

  // 1. 判断用户是否存在分组，不存在则创建默认 "自选表" 分组
  const defaultWatchlist = await prisma.watchlist.findFirst({
    where: { userId, isDefault: true }
  });

  if (!defaultWatchlist) {
    await prisma.watchlist.create({
      data: { userId, name: "自选表", isDefault: true }
    });
  }

  // 2. 获取用户的所有分组
  const watchlists = await prisma.watchlist.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      description: true,
      order: true,
      isDefault: true
    },
    orderBy: { order: "asc" }
  });

  // 3. 一次性获取该用户所有的股票
  const stocks = await prisma.watch.findMany({
    where: { userId },
    select: {
      id: true,
      watchlistId: true,
      type: true,
      code: true,
      name: true,
      note: true,
      order: true,
      isTop: true
    },
    orderBy: [{ isTop: "desc" }, { order: "asc" }]
  });

  // 4. 获取最新的批次时间
  const maxDate = await prisma.stockQuotesRealTime.findFirst({
    select: { date: true },
    orderBy: { date: "desc" }
  });

  // 5. 获取股票的最新行情
  const quotes = await prisma.stockQuotesRealTime.findMany({
    where: {
      date: maxDate?.date,
      code: { in: stocks.map(stock => stock.code) }
    },
    distinct: ["code"],
    orderBy: { newPrice: "desc" }
  });

  // 6. 按 watchlistId 对股票进行分组
  const stocksByWatchlist = stocks.reduce((acc, stock) => {
    if (!acc[stock.watchlistId]) {
      acc[stock.watchlistId] = [];
    }
    acc[stock.watchlistId].push(stock);
    return acc;
  }, {} as Record<string, typeof stocks>);

  // 7. 组装最终数据
  const watchlistsWithStocks = watchlists.map(list => ({
    id: list.id,
    name: list.name,
    description: list.description,
    order: list.order,
    isDefault: list.isDefault,
    stocks: (stocksByWatchlist[list.id] || []).map(stock => ({
      ...stock,
      quote: quotes.find(quote => quote.code === stock.code)
    }))
  })) as WatchlistWithStocks[];

  return Response.json({
    success: true,
    data: watchlistsWithStocks
  });
};
