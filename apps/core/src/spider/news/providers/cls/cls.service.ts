import dayjs from "dayjs";
import { Injectable, Logger } from "@nestjs/common";
import { getCurrentUnixTime, delayRandom } from "@trade-signal/shared";

import { getClsNews } from "../../../../api/news.cls";
import { NewsProvider } from "../../interfaces/news-provider.interface";
import { NewsItem, NewsQuery } from "../../news.types";

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

  private transformClsNews(data: ClsNews[]): NewsItem[] {
    return data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content
    }));
  }

  async getNews(query: NewsQuery): Promise<NewsItem[]> {
    this.logger.debug(`开始获取财联社数据`);

    const newsMap = new Map<string, ClsNews[]>(
      ClsService.CLS_CATEGORIES.map(category => [category, []])
    );

    for (const category of ClsService.CLS_CATEGORIES) {
      let lastTime = getCurrentUnixTime();
      let page = 1;

      while (true) {
        try {
          const data = await getClsNews(category, lastTime);

          if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error(`${category} 分类数据获取失败: 数据为空`);
          }

          newsMap.set(category, [...(newsMap.get(category) || []), ...data]);

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
  }
}
