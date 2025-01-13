import dayjs from "dayjs";
import prisma from "@/prisma/db";
import { createLogger } from "@/shared/logger";
import { seedSinaNews } from "@/cron/news/sina";
import { seedClsNews } from "@/cron/news/cls";

const spider_name = "news";
const logger = createLogger(spider_name, "", false);

// 清除超过7天的数据
export const cleanNews = async () => {
  logger.log("check if there is data older than 7 days");

  const result = await prisma.news.deleteMany({
    where: {
      date: {
        lt: dayjs().subtract(7, "day").toDate()
      }
    }
  });

  if (result.count === 0) {
    logger.log("no data older than 7 days");
  } else {
    logger.log(`clean ${result.count} data older than 7 days`);
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
    logger.log(`start get news`);

    // 获取新闻数据
    await Promise.all([seedSinaNews(), seedClsNews()]);

    logger.log(`get news success`);
  } catch (error) {
    logger.log(`get news error: ${error}`);
  }
};

export const initNewsData = async (runDate: string) => {
  const hasNews = await checkNews(runDate);

  if (hasNews) {
    logger.log("news available! No need to seed.");
    return;
  }

  await seedNews();
};
