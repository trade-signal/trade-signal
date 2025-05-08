import { Injectable, Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { getRunDate } from "@trade-signal/shared";

import { PrismaService } from "src/common/database/prisma.service";
import { SinaService } from "./providers/sina/sina.service";
import { ClsService } from "./providers/cls/cls.service";

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sinaService: SinaService,
    private readonly clsService: ClsService
  ) {
    this.initNews(getRunDate());
  }

  // 清除超过指定天数的数据
  async cleanNews(days: number = 7) {
    try {
      this.logger.log(`check if there is data older than ${days} days`);

      const result = await this.prisma.news.deleteMany({
        where: {
          date: { lt: dayjs().subtract(days, "day").toDate() }
        }
      });

      if (result.count === 0) {
        this.logger.log(`no data older than ${days} days`);
      } else {
        this.logger.log(`clean ${result.count} data older than ${days} days`);
      }
    } catch (error) {
      this.logger.error(`clean news error: ${error}`);
    }
  }

  // 检查是否存在新闻
  async checkNews(date?: string) {
    const runDate = dayjs(date);
    const news = await this.prisma.news.findMany({
      where: {
        date: {
          gte: runDate.startOf("day").toDate(),
          lte: runDate.endOf("day").toDate()
        }
      }
    });
    return news.length > 0;
  }

  // 获取新闻
  async getNews() {
    try {
      this.logger.log("start get news");

      await Promise.all([
        this.sinaService.getNews(),
        this.clsService.getNews()
      ]);

      this.logger.log("get news success");
    } catch (error) {
      this.logger.error(`getNews error: ${error}`);
    }
  }

  // 初始化新闻
  async initNews(runDate: string) {
    const hasNews = await this.checkNews(runDate);

    if (hasNews) {
      this.logger.log("news available! No need to fetch.");
      return;
    }

    await this.getNews();
  }
}
