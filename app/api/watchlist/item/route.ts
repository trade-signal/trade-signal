import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

const getFirstStock = async () => {
  const stock = await prisma.stock.findFirst({
    select: { code: true },
    orderBy: { code: "asc" }
  });
  return stock?.code ?? null;
};

const getCode = async (session: Session | null, code: string | null) => {
  if (code) return code;

  if (session) {
    const watchlist = await prisma.watchlist.findFirst({
      where: { userId: session.user.id, isDefault: true }
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

  let code = req.nextUrl.searchParams.get("code");

  if (!code) {
    code = await getCode(session, code);
  }

  if (!code) {
    return Response.json({
      success: false,
      message: "No code found"
    });
  }

  const maxDate = await prisma.stockQuotesRealTime.findFirst({
    select: { date: true },
    orderBy: { date: "desc" }
  });

  const stock = await prisma.stockQuotesRealTime.findFirst({
    where: { date: maxDate?.date, code },
    distinct: ["code"],
    orderBy: [{ updatedAt: "desc" }, { newPrice: "desc" }]
  });

  return Response.json({
    success: true,
    data: stock
  });
};
