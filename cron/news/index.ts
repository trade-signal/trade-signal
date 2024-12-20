import dayjs from "dayjs";
import prisma from "@/prisma/db";
import { getNews } from "./sina";
import { createLogger } from "@/cron/util/logger";

const spider_name = "world_news";
const print = createLogger(spider_name);

// 清除超过7天的数据
const clearOldNews = async () => {
  print("检测是否存在超过7天的数据");

  const result = await prisma.news.deleteMany({
    where: {
      date: {
        lt: dayjs().subtract(3, "day").toDate()
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

// 转换新闻数据
const transformSinaNews = (news: any) => {
  return news.map((item: any) => {
    const { id, rich_text, create_time, tag, ext } = item;
    const { stocks, docurl } = JSON.parse(ext || "{}");

    return {
      source: "新浪财经",
      sourceId: String(id),
      sourceUrl: docurl || "",
      content: rich_text || "",
      date: new Date(create_time),
      tags: JSON.stringify(tag || []),
      stocks: JSON.stringify(stocks || [])
    };
  });
};

// 获取新闻
export const seedNews = async () => {
  try {
    print(`开始获取新闻数据`);

    const news = await getNews();

    if (news.length === 0) {
      print(`获取数据为空`);
      return;
    }

    // 清理3天前的历史数据
    await clearOldNews();

    const newsData = transformSinaNews(news);

    print(`获取到 ${newsData.length} 条新闻`);
    print(`开始写入数据库`);

    await prisma.news.createMany({
      data: newsData,
      skipDuplicates: true // 跳过重复记录
    });

    print(`数据写入成功`);
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
