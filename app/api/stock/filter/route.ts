import prisma from "@/prisma/db";

export const GET = async () => {
  const data = await prisma.stock.findMany({
    distinct: ["industry"],
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
