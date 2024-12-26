import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma/db";

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

  // 1. 先获取用户的所有分组
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

  // 2. 一次性获取该用户所有的股票
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

  // 3. 按 watchlistId 对股票进行分组
  const stocksByWatchlist = stocks.reduce((acc, stock) => {
    if (!acc[stock.watchlistId]) {
      acc[stock.watchlistId] = [];
    }
    acc[stock.watchlistId].push(stock);
    return acc;
  }, {} as Record<string, typeof stocks>);

  // 4. 组装最终数据
  const watchlistsWithStocks = watchlists.map(list => ({
    id: list.id,
    name: list.name,
    description: list.description,
    order: list.order,
    isDefault: list.isDefault,
    stocks: stocksByWatchlist[list.id] || []
  }));

  return Response.json({
    success: true,
    data: watchlistsWithStocks
  });
};
