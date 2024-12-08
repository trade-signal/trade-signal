import prisma from "@/prisma/db";

export const GET = async () => {
  const stocks = await prisma.stock.findMany();

  return Response.json({
    success: true,
    data: stocks
  });
};
