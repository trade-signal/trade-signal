import prisma from "@/prisma/db";
import dayjs from "dayjs";

const getUniqueItems = (
  data: { categories: string[] }[],
  field: "categories"
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
  const sinaNews = await prisma.news.findMany({
    select: { categories: true },
    where: {
      source: "sina",
      date: {
        gte: dayjs().subtract(3, "day").toDate()
      }
    }
  });

  const clsNews = await prisma.news.findMany({
    select: { categories: true },
    where: {
      source: "cls",
      date: {
        gte: dayjs().subtract(3, "day").toDate()
      }
    }
  });

  return Response.json({
    success: true,
    data: {
      sina: {
        categories: getUniqueItems(sinaNews, "categories")
      },
      cls: {
        categories: getUniqueItems(clsNews, "categories")
      }
    }
  });
};
