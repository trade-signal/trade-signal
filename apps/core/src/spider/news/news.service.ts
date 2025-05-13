import { Injectable, Logger } from "@nestjs/common";
import { getRunDate } from "@trade-signal/shared";
import dayjs from "dayjs";

import { PrismaService } from "src/common/database/prisma.service";
import { SinaService } from "./providers/sina/sina.service";
import { ClsService } from "./providers/cls/cls.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sinaService: SinaService,
    private readonly clsService: ClsService
  ) {}

  async onModuleInit() {
    this.logger.log("news service init");

    await this.initNews();

    this.logger.log("news service init completed");
  }

  // 工作日运行:
  // 1. 交易时段 (9:00-11:30, 13:00-15:00) 每30分钟抓取一次
  @Cron("*/30 9-11,13-14 * * 1-5")
  async workdayTradingHandle() {
    this.logger.log("workday update news");

    await this.getNews();
  }
  // 2. 非交易时段 (8:30-9:00, 11:30-13:00, 15:00-21:30) 每15分钟抓取一次
  @Cron("*/15 8,12,15-21 * * 1-5")
  async workdayNoTradingHandle() {
    this.logger.log("workday update news");

    await this.getNews();
  }

  // 非工作日运行: 每小时抓取一次
  // 周末 (周六、周日 9:00-21:00) 每小时抓取一次
  @Cron("0 9-21 * * 0,6")
  async nonWorkdayHandle() {
    this.logger.log("non workday update news");

    await this.getNews();
  }

  // 每天清晨 5:30 清理数据（在开盘前）
  @Cron("30 5 * * *")
  async dailyCleanHandle() {
    this.logger.log("daily clean news");

    await this.cleanNews();
  }

  // --------------------- 新闻信息 ---------------------

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

      const news = await Promise.all([
        this.sinaService.getNews(),
        this.clsService.getNews()
      ]);

      const newsData = news.flat() as any;

      this.logger.log(`get ${newsData.length} news`);

      await this.prisma.news.createMany({
        data: newsData,
        skipDuplicates: true
      });

      this.logger.log(`insert ${newsData.length} news`);
    } catch (error) {
      this.logger.error(`getNews error: ${error}`);
    }
  }

  // 初始化新闻
  async initNews() {
    const runDate = getRunDate();
    const hasNews = await this.checkNews(runDate);

    if (hasNews) {
      this.logger.log("news available! No need to fetch.");
      return;
    }

    await this.getNews();
  }
}
