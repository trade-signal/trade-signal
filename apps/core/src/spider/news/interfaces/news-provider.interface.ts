import { NewsQuery, NewsItem } from "../news.types";

export interface NewsProvider {
  getNews(query: NewsQuery): Promise<NewsItem[]>;
}
