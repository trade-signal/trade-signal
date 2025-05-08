import { Injectable, Logger } from "@nestjs/common";

import { NewsProvider } from "../../interfaces/news-provider.interface";
import { NewsItem, NewsQuery } from "../../news.types";
import { SinaNews, SinaNewsExt } from "./sina.types";
import { getSinaNews } from "src/api/news.sina";

@Injectable()
export class SinaService implements NewsProvider {
  private readonly logger = new Logger(SinaService.name);

  transformNews(data: SinaNews[]): NewsItem[] {
    return data.map(item => {
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
  }

  async getNews(): Promise<NewsItem[]> {
    const result: NewsItem[] = [];

    let page = 1;
    let pageSize = 100;

    this.logger.debug(`start getNews`);

    while (true) {
      try {
        const response = await getSinaNews(page, pageSize);

        if (!response.status || response.status.code !== 0) {
          this.logger.error(JSON.stringify(response));
          throw new Error(`getNews error: ${response.msg || "unknown error"}`);
        }

        const { page_info, list } = (response.data && response.data.feed) || {};

        if (!page_info || !list || !Array.isArray(list)) {
          throw new Error(`getNews error: data is empty`);
        }

        result.push(...this.transformNews(list));

        const { totalPage } = page_info;
        if (!totalPage || page >= totalPage) break;

        page++;
      } catch (error) {
        this.logger.error(`getNews error: ${error}`);
        break;
      }
    }

    this.logger.debug(`getNews end`);

    return result;
  }
}
