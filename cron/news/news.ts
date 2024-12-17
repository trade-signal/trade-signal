import prisma from "@/prisma/db";
import { get } from "@/shared/request";
import dayjs from "dayjs";

const spider_name = "world_news";

const print = (message: string) => {
  console.log(`[${spider_name}] ${message}`);
};

/**
 * 全球财经快讯
 *
 * 新浪财经-全球财经快讯
 * https://finance.sina.com.cn/7x24
 *
 * @param page 页码
 * @param pageSize 每页数量
 */
const getWorldNews = async (page: number, pageSize: number) => {
  try {
    const url = `https://zhibo.sina.com.cn/api/zhibo/feed`;

    const response = await get(url, {
      page,
      page_size: pageSize,
      zhibo_id: 152,
      tag_id: 0,
      dire: "f",
      dpc: 1
    });

    if (!response.result) {
      throw new Error(
        `获取全球财经快讯失败: ${response.message || "未知错误"}`
      );
    }

    return response.result;
  } catch (error) {
    print(`获取全球财经快讯失败: ${error}`);
    return [];
  }
};

// 获取近七天
const getNews = async () => {
  let page = 1;
  let pageSize = 100;

  const news = [];

  while (true) {
    print(`正在获取第${page}页数据`);

    try {
      const response = await getWorldNews(page, pageSize);

      if (!response.status || response.status.code !== 0) {
        throw new Error(`获取全球财经快讯失败: ${response.msg || "未知错误"}`);
      }

      const { page_info, list } = (response.data && response.data.feed) || {};

      if (!page_info || !list || !Array.isArray(list)) {
        throw new Error(`获取全球财经快讯失败: 数据为空`);
      }

      news.push(...list);

      const { totalPage } = page_info;
      if (!totalPage || page >= totalPage) break;

      page++;
    } catch (error) {
      print(`获取全球财经快讯失败: ${error}`);
      break;
    }
  }

  return news;
};

// 清除超过7天的数据
const clearOldNews = async () => {
  await prisma.news.deleteMany({
    where: {
      date: {
        lt: dayjs().subtract(7, "day").toDate()
      }
    }
  });
};

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

const transformNews = (news: any) => {
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

// 获取最新全球财经快讯
export const seedLatestNews = async () => {
  print(`开始获取最新全球财经快讯`);

  const news = await getWorldNews(1, 20);
  const newsData = transformNews(news);

  print(`全球财经快讯数量: ${newsData.length}`);
  print(`开始写入全球财经快讯`);

  await prisma.news.createMany({
    data: newsData,
    skipDuplicates: true
  });

  print(`写入全球财经快讯成功`);
};

// 获取全球财经快讯
export const seedNews = async () => {
  print(`开始获取全球财经快讯`);

  const news = await getNews();

  if (news.length === 0) {
    print(`全球财经快讯为空`);
    return;
  }

  await clearOldNews();

  const newsData = transformNews(news);

  print(`全球财经快讯数量: ${newsData.length}`);
  print(`开始写入全球财经快讯`);

  await prisma.news.createMany({
    data: newsData,
    skipDuplicates: true
  });

  print(`写入全球财经快讯成功`);
};

export const initNewsData = async (runDate: string) => {
  const hasNews = await checkNews(runDate);

  if (hasNews) {
    console.log("News available! No need to seed.");
    return;
  }

  await seedNews();
};
