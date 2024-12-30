import dayjs from "dayjs";
import prisma from "@/prisma/db";
import { createLogger } from "../util";
import { seedSinaNews } from "./sina";
import { seedClsNews } from "./cls";

const spider_name = "news";
const print = createLogger(spider_name);

// 清除超过7天的数据
export const cleanNews = async () => {
  print("check if there is data older than 7 days");

  const result = await prisma.news.deleteMany({
    where: {
      date: {
        lt: dayjs().subtract(7, "day").toDate()
      }
    }
  });

  if (result.count === 0) {
    print("no data older than 7 days");
  } else {
    print(`clean ${result.count} data older than 7 days`);
  }
};

// 检查是否存在新闻
export const checkNews = async (date?: string) => {
  const runDate = dayjs(date);
  const news = await prisma.news.findMany({
    where: {
      date: {
        gte: runDate.startOf("day").toDate(),
        lte: runDate.endOf("day").toDate()
      }
    }
  });
  return news.length > 0;
};

// 获取新闻
export const seedNews = async () => {
  try {
    print(`start get news`);

    // 获取新闻数据
    await Promise.all([seedSinaNews(), seedClsNews()]);

    print(`get news success`);
  } catch (error) {
    print(`get news error: ${error}`);
  }
};

export const initNewsData = async (runDate: string) => {
  const hasNews = await checkNews(runDate);

  if (hasNews) {
    print("news available! No need to seed.");
    return;
  }

  await seedNews();
};
