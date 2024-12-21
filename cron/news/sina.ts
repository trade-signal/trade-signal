import { get } from "@/shared/request";
import { createLogger } from "@/cron/util/logger";
import { News } from "@prisma/client";
import prisma from "@/prisma/db";

const spider_name = "sina";
const print = createLogger(spider_name);

/**
 * 全球财经快讯
 *
 * 新浪财经-全球财经快讯
 * https://finance.sina.com.cn/7x24
 *
 * @param page 页码
 * @param pageSize 每页数量
 */
const fetchNews = async (page: number, pageSize: number) => {
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

// 获取近七天数据
export const getNews = async () => {
  let page = 1;
  let pageSize = 100;

  const news = [];

  while (true) {
    print(`正在获取第${page}页数据`);

    try {
      const response = await fetchNews(page, pageSize);

      if (!response.status || response.status.code !== 0) {
        print(JSON.stringify(response));
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

interface SinaNews {
  id: number;
  zhibo_id: number;
  type: number;
  rich_text: string;
  multimedia: string;
  commentid: string;
  compere_id: number;
  creator: string;
  mender: string;
  create_time: string;
  update_time: string;
  is_need_check: string;
  check_time: string;
  check_status: string;
  check_user: string;
  is_delete: number;
  top_value: number;
  is_focus: number;
  source_content_id: string;
  anchor_image_url: string;
  anchor: string;
  ext: string; // JSON字符串
  old_live_cid: string;
  tab: string;
  is_repeat: string;
  tag: Array<{
    id: string;
    name: string;
  }>;
  like_nums: number;
  comment_list: {
    list: any[];
    total: number;
    thread_show: number;
    qreply: number;
    qreply_show: number;
    show: number;
  };
  docurl: string;
  rich_text_nick_to_url: any[];
  rich_text_nick_to_routeUri: any[];
  compere_info: string;
}

// 为ext字段添加额外的类型定义
interface SinaNewsExt {
  stocks: Array<{
    market: string;
    symbol: string;
    key: string;
  }>;
  needPushWB: boolean;
  needCMSLink: boolean;
  needCalender: boolean;
  docurl: string;
  docid: string;
}

// 转换新闻数据
const transformSinaNews = (data: SinaNews[]) => {
  return data.map((item: SinaNews) => {
    const { id, rich_text, create_time, tag, ext } = item;
    const { stocks: stockList, docurl } = JSON.parse(
      ext || "{}"
    ) as SinaNewsExt;

    return {
      source: "sina",
      sourceId: String(id),
      sourceUrl: docurl || "",
      title: rich_text?.slice(0, 100) || "",
      summary: rich_text?.slice(0, 200) || "",
      content: rich_text || "",
      date: new Date(create_time),
      tags: tag?.map(t => t.name) || [],
      categories: tag?.map(t => t.name) || [],
      stocks:
        stockList?.map(s => ({
          code: s.symbol,
          market: s.market,
          name: s.key
        })) || []
    };
  });
};

export const seedSinaNews = async () => {
  try {
    const newsData = await getNews();
    print(`获取到 ${newsData.length} 条新闻`);

    print(`开始转换新闻数据`);
    const transformedNews = transformSinaNews(newsData);

    print(`开始写入数据库`);
    await prisma.$transaction(async tx => {
      const results = await Promise.all(
        transformedNews.map(news =>
          tx.news.upsert({
            where: {
              source_sourceId: {
                source: news.source,
                sourceId: news.sourceId
              }
            },
            create: news,
            update: news
          })
        )
      );

      print(`成功处理 ${results.length} 条新闻数据`);
    });
  } catch (error) {
    print(`处理新闻数据失败: ${error}`);
  }
};
