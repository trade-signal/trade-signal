import prisma from "@/app/utils/prisma";

export const GET = async () => {
  const data = await prisma.stockBasic.findMany({
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
