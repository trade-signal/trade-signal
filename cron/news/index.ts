import dayjs from "dayjs";
import prisma from "@/prisma/db";
import { createLogger } from "@/cron/util/logger";
import { seedSinaNews } from "./sina";
import { seedClsNews } from "./cls";

const spider_name = "news";
const print = createLogger(spider_name);

// 清除超过7天的数据
const clearOldNews = async () => {
  print("检测是否存在超过7天的数据");

  const result = await prisma.news.deleteMany({
    where: {
      date: {
        lt: dayjs().subtract(7, "day").toDate()
      }
    }
  });

  if (result.count === 0) {
    print("没有超过7天的数据需要清理");
  } else {
    print(`已清理 ${result.count} 条超过7天的数据`);
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
    print(`开始获取新闻数据`);

    // 清理历史数据
    await clearOldNews();

    // 获取新闻数据
    await Promise.all([seedSinaNews(), seedClsNews()]);

    print(`新闻数据获取成功`);
  } catch (error) {
    print(`新闻数据获取失败: ${error}`);
  }
};

export const initNewsData = async (runDate: string) => {
  const hasNews = await checkNews(runDate);

  if (hasNews) {
    print("News available! No need to seed.");
    return;
  }

  await seedNews();
};
