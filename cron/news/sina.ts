import { get } from "@/shared/request";
import { createLogger } from "@/cron/util/logger";

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

// 获取近七天
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
