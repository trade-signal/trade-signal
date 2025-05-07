import { Injectable } from "@nestjs/common";

import { NewsProvider } from "../../interfaces/news-provider.interface";
import { NewsItem, NewsQuery } from "../../news.types";

@Injectable()
export class SinaService implements NewsProvider {
  async getNews(query: NewsQuery): Promise<NewsItem[]> {
    const { page, pageSize } = query;
    const url = `https://www.sina.com.cn/api/v1/news/list?page=${page}&pageSize=${pageSize}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}
