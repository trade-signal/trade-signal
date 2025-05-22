import prisma from "@/app/utils/prisma";
import { success } from "@/app/utils/response";

export const GET = async () => {
  const data = await prisma.stockBasic.findMany({
    distinct: ["industry"],
    select: { industry: true },
    orderBy: { industry: "asc" }
  });

  return success(null, {
    data: {
      industries: data.map(item => item.industry)
    }
  });
};
