import prisma from "@/prisma/db";
import dayjs from "dayjs";

const getUniqueItems = (
  data: { tags: string[]; categories: string[] }[],
  field: "tags" | "categories"
) => {
  const uniqueItems = new Set<string>();

  data.forEach(item => {
    const items = item[field];
    if (Array.isArray(items)) {
      items.forEach(value => uniqueItems.add(value));
    }
  });

  return Array.from(uniqueItems).sort();
};

export const GET = async () => {
  const data = await prisma.news.findMany({
    select: { tags: true, categories: true },
    where: {
      date: {
        gte: dayjs().subtract(3, "day").toDate()
      }
    }
  });

  return Response.json({
    success: true,
    data: {
      tags: getUniqueItems(data, "tags"),
      categories: getUniqueItems(data, "categories")
    }
  });
};
