import dayjs from "dayjs";
import { Injectable, Logger } from "@nestjs/common";
import { getCurrentUnixTime, delayRandom } from "@trade-signal/shared";

import { getClsNews } from "src/spider/api/news.cls";
import { NewsProvider } from "../../interfaces/news-provider.interface";
import { NewsItem } from "../../news.types";

@Injectable()
export class ClsService implements NewsProvider {
  private readonly logger = new Logger(ClsService.name);

  private static readonly CLS_CATEGORIES = [
    "", // 全部
    "red", // 红色
    "announcement", // 公告
    "watch", // 看盘
    "hk_us", // 港股美股
    "fund" // 基金
  ];

  public transformNews(data: ClsNews[], category: string): NewsItem[] {
    return data.map(item => {
      const {
        id,
        content,
        shareurl,
        title,
        brief,
        ctime,
        subjects,
        stock_list
      } = item;

      return {
        source: "cls",
        sourceId: String(id),
        sourceUrl: shareurl,
        title: title,
        summary: brief,
        content: content,
        date: new Date(ctime * 1e3),
        // hack: use subject_name as tags
        tags: subjects?.map(item => item.subject_name) || [],
        categories: [category],
        stocks:
          stock_list?.map(item => ({
            market: "",
            code: item.StockID,
            name: item.name
          })) || []
      };
    });
  }

  async getNews(): Promise<NewsItem[]> {
    this.logger.debug(`开始获取财联社数据`);

    const result: NewsItem[] = [];

    for (const category of ClsService.CLS_CATEGORIES) {
      let lastTime = getCurrentUnixTime();
      let page = 1;

      while (true) {
        try {
          const data = await getClsNews(category, lastTime);

          if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error(`${category} 分类数据获取失败: 数据为空`);
          }

          result.push(...this.transformNews(data, category));

          lastTime = data[data.length - 1].ctime;

          const time = dayjs(lastTime * 1e3);

          // 如果时间超过24小时前，或者页码大于30，则停止
          if (time.isBefore(dayjs().subtract(24, "hours")) || page >= 30) break;

          page++;
        } catch (error) {
          this.logger.error(`${category} 分类数据获取失败: ${error}`);
          break;
        }
      }

      await delayRandom();
    }

    this.logger.debug(`财联社数据获取完成`);

    return result;
  }
}
