import dayjs from "dayjs";
import prisma from "@/prisma/db";
import { createLogger } from "@/shared/logger";
import { fetchSinaNews } from "@/cron/news/sina";
import { fetchClsNews } from "@/cron/news/cls";

const spider_name = "news";
const logger = createLogger(spider_name, "", false);

// 清除超过指定天数的数据
export const cleanNews = async (days: number = 7) => {
  try {
    logger.log(`check if there is data older than ${days} days`);

    const result = await prisma.news.deleteMany({
      where: {
        date: {
          lt: dayjs().subtract(days, "day").toDate()
        }
      }
    });

    if (result.count === 0) {
      logger.log(`no data older than ${days} days`);
    } else {
      logger.log(`clean ${result.count} data older than ${days} days`);
    }
  } catch (error) {
    logger.error(`clean news error: ${error}`);
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
export const fetchNews = async () => {
  try {
    logger.log(`start get news`);

    // 获取新闻数据
    await Promise.all([fetchSinaNews(), fetchClsNews()]);

    logger.log(`get news success`);
  } catch (error) {
    logger.log(`get news error: ${error}`);
  }
};

export const initNews = async (runDate: string) => {
  const hasNews = await checkNews(runDate);

  if (hasNews) {
    logger.log("news available! No need to fetch.");
    return;
  }

  await fetchNews();
};
