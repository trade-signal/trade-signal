import { get } from "@trade-signal/shared";

/**
 * 全球财经快讯
 *
 * 新浪财经-全球财经快讯
 * https://finance.sina.com.cn/7x24
 *
 * @param page 页码
 * @param pageSize 每页数量
 */
export const getSinaNews = async (page: number, pageSize: number) => {
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
      throw new Error(`getNews error: ${response.message || "unknown error"}`);
    }

    return response.result;
  } catch (error) {
    return [];
  }
};
