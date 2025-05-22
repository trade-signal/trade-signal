import prisma from "@/app/utils/prisma";
import dayjs from "dayjs";
import { success } from "@/app/utils/response";

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

  return Array.from(uniqueItems)
    .filter(item => item.trim())
    .sort();
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

  return success(null, {
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
