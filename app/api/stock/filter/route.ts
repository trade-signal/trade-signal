import prisma from "@/prisma/db";

export const GET = async () => {
  const data = await prisma.stockSelection.findMany({
    distinct: ["industry"],
    select: { industry: true, concept: true },
    orderBy: { industry: "asc" }
  });

  const concepts = data.reduce((acc, curr) => {
    const values = curr.concept.split(",");

    values.forEach(value => {
      acc.add(value);
    });

    return acc;
  }, new Set<string>());

  return Response.json({
    success: true,
    data: {
      industries: data.map(item => item.industry),
      concepts: Array.from(concepts)
    }
  });
};
