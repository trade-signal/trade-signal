import prisma from "@/prisma/db";

export const GET = async () => {
  const maxDate = await prisma.stockQuotesRealTime.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const data = await prisma.stockQuotesRealTime.findMany({
    distinct: ["industry"],
    where: { date: { equals: maxDate?.date } },
    select: { industry: true },
    orderBy: { industry: "asc" }
  });

  return Response.json({
    success: true,
    data: {
      industries: data.map(item => item.industry)
    }
  });
};
