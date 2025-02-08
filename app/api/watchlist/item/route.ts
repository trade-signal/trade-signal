import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";
import { errorResponse } from "@/middleware";

const getFirstStock = async () => {
  const stock = await prisma.stockBasic.findFirst({
    select: { code: true },
    orderBy: { code: "asc" }
  });
  return stock?.code ?? null;
};

const getCode = async (userId: string, code: string | null) => {
  if (code) return code;

  if (userId) {
    const watchlist = await prisma.watchlist.findFirst({
      where: { userId, isDefault: true }
    });
    if (watchlist) {
      const stocks = await prisma.watch.findMany({
        where: { watchlistId: watchlist.id }
      });
      if (stocks.length > 0) {
        code = stocks[0].code;
      } else {
        code = await getFirstStock();
      }
    } else {
      code = await getFirstStock();
    }
  } else {
    code = await getFirstStock();
  }

  return code;
};

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  if (!userId) {
    return errorResponse("未授权访问", 401);
  }

  let code = req.nextUrl.searchParams.get("code");

  if (!code) {
    code = await getCode(userId, code);
  }

  if (!code) {
    return Response.json({
      success: false,
      message: "No code found"
    });
  }

  const stock = await prisma.stockQuotes.findFirst({
    where: { code }
  });

  return Response.json({
    success: true,
    data: stock
  });
};
