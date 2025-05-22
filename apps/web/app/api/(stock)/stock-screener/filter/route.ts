import prisma from "@/app/utils/prisma";
import { success } from "@/app/utils/response";

export const GET = async () => {
  const maxDate = await prisma.stockScreener.findFirst({
    orderBy: { date: "desc" },
    select: { date: true }
  });

  const data = await prisma.stockScreener.findMany({
    distinct: ["industry"],
    where: { date: { equals: maxDate?.date } },
    select: { industry: true, concept: true, style: true },
    orderBy: { industry: "asc" }
  });

  const concepts = data.reduce((acc, curr) => {
    const values = curr.concept.split(",");

    values.forEach(value => {
      acc.add(value);
    });

    return acc;
  }, new Set<string>());

  const styles = data.reduce((acc, curr) => {
    const values = curr.style.split(",");

    values.forEach(value => {
      acc.add(value);
    });

    return acc;
  }, new Set<string>());

  return success(null, {
    data: {
      industries: data.map(item => item.industry),
      concepts: Array.from(concepts),
      styles: Array.from(styles)
    }
  });
};
