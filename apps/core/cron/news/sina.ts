import prisma from "@/packages/database/prisma/db";
import { createLogger } from "@/apps/core/cron/util";
import { getSinaNews } from "@/apps/core/cron/api";

const spider_name = "sina";
const print = createLogger(spider_name, "news");

export const getNews = async () => {
  const news = [];

  let page = 1;
  let pageSize = 100;

  print(`start getNews`);

  while (true) {
    try {
      const response = await getSinaNews(page, pageSize);

      if (!response.status || response.status.code !== 0) {
        print(JSON.stringify(response));
        throw new Error(`getNews error: ${response.msg || "unknown error"}`);
      }

      const { page_info, list } = (response.data && response.data.feed) || {};

      if (!page_info || !list || !Array.isArray(list)) {
        throw new Error(`getNews error: data is empty`);
      }

      news.push(...list);

      const { totalPage } = page_info;
      if (!totalPage || page >= totalPage) break;

      page++;
    } catch (error) {
      print(`getNews error: ${error}`);
      break;
    }
  }

  print(`getNews end`);

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
  print(`开始转换新闻数据`);

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
          market: s.market,
          code: s.symbol,
          name: s.key
        })) || []
    };
  });
};

export const fetchSinaNews = async () => {
  try {
    const newsData = await getNews();
    print(`get ${newsData.length} news`);

    const transformedNews = transformSinaNews(newsData);

    print(`transformed ${transformedNews.length} news`);

    print(`开始写入数据库`);

    await prisma.news.createMany({
      data: transformedNews,
      skipDuplicates: true // 跳过重复记录
    });

    print(`write news success`);
  } catch (error) {
    print(`getNews error: ${error}`);
  }
};
