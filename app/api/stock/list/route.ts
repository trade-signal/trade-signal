import { type NextRequest } from "next/server";
import prisma from "@/prisma/db";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const industries = searchParams.get("industries");
  const concepts = searchParams.get("concepts");

  const data = await prisma.stockSelection.findMany({
    where: {
      industry: {
        in: industries?.split(",") || []
      },
      concept: {
        in: concepts?.split(",") || []
      }
    }
  });

  return {
    success: true,
    data: data
  };
};
