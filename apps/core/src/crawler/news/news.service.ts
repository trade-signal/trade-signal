import { Injectable, Logger } from "@nestjs/common";
import { getRunDate } from "@trade-signal/shared";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import dayjs from "dayjs";

import { PrismaService } from "src/common/database/prisma.service";
import { SinaService } from "./providers/sina/sina.service";
import { ClsService } from "./providers/cls/cls.service";

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  private enableScheduled: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly sinaService: SinaService,
    private readonly clsService: ClsService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    this.enableScheduled = this.configService.get("scheduled.enabled");
  }

  async onModuleInit() {
    this.logger.log("news service init");

    await this.initNews();

    this.logger.log("news service init completed");

    if (!this.enableScheduled) {
      this.logger.log("scheduled disabled, skip cron job");
      return;
    }

    this.initCronJob();
  }

  private async initCronJob() {
    if (!this.enableScheduled) {
      this.logger.log("scheduled disabled, skip cron job");
      return;
    }

    this.logger.log("init cron job");

    // 工作日运行:
    // 1. 交易时段 (9:00-11:30, 13:00-15:00) 每30分钟抓取一次
    this.schedulerRegistry.addCronJob(
      "news-workdayTrading",
      new CronJob("*/30 9-11,13-14 * * 1-5", () => {
        this.logger.log("workday update news");
        this.getNews();
      })
    );
    // 2. 非交易时段 (8:30-9:00, 11:30-13:00, 15:00-21:30) 每15分钟抓取一次
    this.schedulerRegistry.addCronJob(
      "news-workdayNoTrading",
      new CronJob("*/15 8,12,15-21 * * 1-5", () => {
        this.logger.log("workday no trading update news");
        this.getNews();
      })
    );

    // 非工作日运行:
    // 1. 周末 (周六、周日 9:00-21:00) 每小时抓取一次
    this.schedulerRegistry.addCronJob(
      "news-nonWorkday",
      new CronJob("0 9-21 * * 0,6", () => {
        this.logger.log("non workday update news");
        this.getNews();
      })
    );

    // 每天凌晨 5:30 清理数据（在开盘前）
    this.schedulerRegistry.addCronJob(
      "news-dailyClean",
      new CronJob("30 5 * * *", () => {
        this.logger.log("daily clean news");
        this.cleanNews();
      })
    );
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
