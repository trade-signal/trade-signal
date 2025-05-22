import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { getRunDate } from "@trade-signal/shared";

import { PrismaService } from "src/common/database/prisma.service";
import { EastMoneyStockService } from "./providers/eastmoney/stock.service";
import { EastMoneyStockPlateService } from "./providers/eastmoney/stock-plate.service";

@Injectable()
export class StockService implements OnModuleInit {
  private readonly logger = new Logger(StockService.name);

  private readonly BATCH_SIZE = 200;

  private enableScheduled: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eastMoneyStockService: EastMoneyStockService,
    private readonly eastMoneyStockPlateService: EastMoneyStockPlateService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    this.enableScheduled = this.configService.get("scheduled.enabled");
  }

  // 初始化股票数据
  async onModuleInit() {
    try {
      this.logger.log("stock service init");

      await Promise.all([
        this.initStockBasic(),
        this.initStockQuotes(),
        this.initStockScreener(),
        this.initStockPlateBasic(),
        this.initStockPlateQuotes()
      ]);

      this.logger.log("stock service init completed");

      this.initCronJob();
    } catch (error) {
      this.logger.error(`stock service init failed: ${error}`);
    }
  }

  private async initCronJob() {
    if (!this.enableScheduled) {
      this.logger.log("scheduled disabled, skip cron job");
      return;
    }

    this.logger.log("init cron job");

    // 工作日运行：(9:00-11:30, 13:00-15:00) 每30分钟抓取一次
    this.schedulerRegistry.addCronJob(
      "stock-workdayTrading",
      new CronJob("*/30 9-11,13-14 * * 1-5", () => {
        this.logger.log("workday trading update stock data");
        this.getStockQuotes();
        this.getStockPlateQuotes();
      })
    );

    // 收盘后运行：16:00
    this.schedulerRegistry.addCronJob(
      "stock-dailyUpdate",
      new CronJob("0 16 * * 1-5", () => {
        this.logger.log("daily update stock data");
        this.getStockQuotes();
        this.getStockScreener();
        this.getStockPlateQuotes();
      })
    );

    // 每月1号运行：更新所有股票、板块基本信息
    this.schedulerRegistry.addCronJob(
      "stock-monthlyUpdate",
      new CronJob("0 0 1 * *", () => {
        this.logger.log("monthly update stock data");
      })
    );

    // 每天凌晨 5:30 清理数据（在开盘前）
    this.schedulerRegistry.addCronJob(
      "stock-dailyClean",
      new CronJob("30 5 * * *", () => {
        this.logger.log("daily clean stock data");
        this.cleanStockQuotes();
        this.cleanStockScreener();
        this.cleanStockPlateQuotes();
      })
    );
  }

  // --------------------- 股票基本信息 ---------------------

  // 检查股票基本信息是否存在
  async checkStockBasic() {
    const stock = await this.prisma.stockBasic.findFirst({});
    return stock !== null;
  }

  // 获取股票数据
  async getStockBasic() {
    const stocks = await this.eastMoneyStockService.getStockBasic();

    this.logger.log(`get ${stocks.length} stocks`);

    try {
      while (stocks.length > 0) {
        const batch = stocks.splice(0, this.BATCH_SIZE);

        await Promise.all(
          batch.map(async item => {
            await this.prisma.stockBasic.upsert({
              where: { code: item.code },
              update: {
                ...item,
                newPrice: undefined // 设置为 undefined 会被 Prisma 忽略
              },
              create: {
                ...item,
                newPrice: undefined // 设置为 undefined 会被 Prisma 忽略
              }
            });
          })
        );

        this.logger.log(`insert ${batch.length} stocks, left ${stocks.length}`);
      }

      this.logger.log("get stock basic success");
    } catch (error) {
      this.logger.error(`get stock basic error: ${error}`);
    }
  }

  // 初始化股票基本信息
  async initStockBasic() {
    const hasStockBasic = await this.checkStockBasic();

    if (hasStockBasic) {
      this.logger.log("stock basic available! No need to fetch.");
      return;
    }

    await this.getStockBasic();
  }

  // --------------------- 股票行情信息 ---------------------

  // 检查股票行情信息是否存在
  async checkStockQuotes(date: string) {
    const stock = await this.prisma.stockQuotes.findFirst({
      where: { date }
    });
    return stock !== null;
  }

  // 清理股票行情信息
  async cleanStockQuotes(days: number = 7) {
    try {
      this.logger.log(`clean stock quotes older than ${days} days`);

      const tradingDays = await this.prisma.stockQuotes.findMany({
        select: { date: true },
        distinct: ["date"],
        orderBy: { date: "desc" }
      });

      if (tradingDays.length > days) {
        const cutoffDate = tradingDays[days - 1].date;
        const result = await this.prisma.stockQuotes.deleteMany({
          where: { date: { lt: cutoffDate } }
        });

        this.logger.log(`clean ${result.count} data`);
        return;
      }

      this.logger.log("no data to clean");
    } catch (error) {
      this.logger.error(`clean stock quotes error: ${error}`);
    }
  }

  // 获取股票行情信息
  async getStockQuotes(date?: string) {
    try {
      this.logger.log(`get stock quotes`);

      const stocks = await this.eastMoneyStockService.getStockQuotes(date);

      while (stocks.length > 0) {
        const batch = stocks.splice(0, this.BATCH_SIZE);

        await Promise.all(
          batch.map(async item => {
            await this.prisma.stockQuotes.upsert({
              where: { date_code: { date: item.date, code: item.code } },
              update: item,
              create: item
            });
          })
        );

        this.logger.log(`insert ${batch.length} stocks, left ${stocks.length}`);
      }

      this.logger.log("get stock quotes success");
    } catch (error) {
      this.logger.error(`get stock quotes error: ${error}`);
    }
  }

  // 初始化股票行情信息
  async initStockQuotes() {
    const runDate = getRunDate();
    const hasStockQuotes = await this.checkStockQuotes(runDate);

    if (hasStockQuotes) {
      this.logger.log("stock quotes available! No need to fetch.");
      return;
    }

    await this.getStockQuotes(runDate);
  }

  // --------------------- 股票选股指标 ---------------------

  // 检查股票选股指标是否存在
  async checkStockScreener() {
    const stock = await this.prisma.stockScreener.findFirst({});
    return stock !== null;
  }

  // 清理股票选股指标
  async cleanStockScreener(days: number = 7) {
    try {
      this.logger.log(`clean stock screener older than ${days} days`);

      const tradingDays = await this.prisma.stockScreener.findMany({
        select: { date: true },
        distinct: ["date"],
        orderBy: { date: "desc" }
      });

      if (tradingDays.length > days) {
        const cutoffDate = tradingDays[days - 1].date;
        const result = await this.prisma.stockScreener.deleteMany({
          where: { date: { lt: cutoffDate } }
        });

        this.logger.log(`clean ${result.count} data`);
        return;
      }

      this.logger.log("no data to clean");
    } catch (error) {
      this.logger.error(`clean stock screener error: ${error}`);
    }
  }

  // 获取股票选股指标
  async getStockScreener() {
    try {
      this.logger.log(`get stock screener`);

      const stocks = await this.eastMoneyStockService.getStockScreener();

      while (stocks.length > 0) {
        const batch = stocks.splice(0, this.BATCH_SIZE);

        await Promise.all(
          batch.map(async item => {
            await this.prisma.stockScreener.upsert({
              where: { date_code: { date: item.date, code: item.code } },
              update: item,
              create: item
            });
          })
        );

        this.logger.log(`insert ${batch.length} stocks, left ${stocks.length}`);
      }

      this.logger.log("get stock screener success");
    } catch (error) {
      this.logger.error(`get stock screener error: ${error}`);
    }
  }

  // 初始化股票选股指标
  async initStockScreener() {
    const hasStockScreener = await this.checkStockScreener();

    if (hasStockScreener) {
      this.logger.log("stock screener available! No need to fetch.");
      return;
    }

    await this.getStockScreener();
  }

  // --------------------- 沪深京板块基本信息 ---------------------

  // 检查沪深京板块基本信息是否存在
  async checkStockPlateBasic() {
    const stock = await this.prisma.stockPlateBasic.findFirst({});
    return stock !== null;
  }

  // 获取沪深京板块基本信息
  async getStockPlateBasic() {
    const stocks = await this.eastMoneyStockPlateService.getStockPlateBasic();

    try {
      while (stocks.length > 0) {
        const batch = stocks.splice(0, this.BATCH_SIZE);

        await Promise.all(
          batch.map(async item => {
            await this.prisma.stockPlateBasic.upsert({
              where: { code: item.code },
              update: {
                ...item,
                newPrice: undefined // 设置为 undefined 会被 Prisma 忽略
              },
              create: {
                ...item,
                newPrice: undefined // 设置为 undefined 会被 Prisma 忽略
              }
            });
          })
        );

        this.logger.log(`insert ${batch.length} stocks, left ${stocks.length}`);
      }

      this.logger.log("get stock plate basic success");
    } catch (error) {
      this.logger.error(`get stock plate basic error: ${error}`);
    }
  }

  // 初始化沪深京板块基本信息
  async initStockPlateBasic() {
    const hasStockPlateBasic = await this.checkStockPlateBasic();

    if (hasStockPlateBasic) {
      this.logger.log("stock plate basic available! No need to fetch.");
      return;
    }

    await this.getStockPlateBasic();
  }

  // --------------------- 沪深京板块行情信息 ---------------------

  // 检查沪深京板块行情信息是否存在
  async checkStockPlateQuotes(date: string) {
    const stock = await this.prisma.stockPlateQuotes.findFirst({
      where: { date }
    });
    return stock !== null;
  }

  // 清理沪深京板块行情信息
  async cleanStockPlateQuotes(days: number = 7) {
    try {
      this.logger.log(`clean stock plate quotes older than ${days} days`);

      const tradingDays = await this.prisma.stockPlateQuotes.findMany({
        select: { date: true },
        distinct: ["date"],
        orderBy: { date: "desc" }
      });

      if (tradingDays.length > days) {
        const cutoffDate = tradingDays[days - 1].date;
        const result = await this.prisma.stockPlateQuotes.deleteMany({
          where: { date: { lt: cutoffDate } }
        });

        this.logger.log(`clean ${result.count} data`);
        return;
      }

      this.logger.log("no data to clean");
    } catch (error) {
      this.logger.error(`clean stock plate quotes error: ${error}`);
    }
  }

  // 获取沪深京板块行情信息
  async getStockPlateQuotes(date?: string) {
    try {
      this.logger.log(`get stock plate quotes`);

      const stocks =
        await this.eastMoneyStockPlateService.getStockPlateQuotes(date);

      while (stocks.length > 0) {
        const batch = stocks.splice(0, this.BATCH_SIZE);

        await Promise.all(
          batch.map(async item => {
            await this.prisma.stockPlateQuotes.upsert({
              where: { date_code: { date: item.date, code: item.code } },
              update: item,
              create: item
            });
          })
        );

        this.logger.log(`insert ${batch.length} stocks, left ${stocks.length}`);
      }

      this.logger.log("get stock plate quotes success");
    } catch (error) {
      this.logger.error(`get stock plate quotes error: ${error}`);
    }
  }

  // 初始化沪深京板块行情信息
  async initStockPlateQuotes() {
    const runDate = getRunDate();
    const hasStockPlateQuotes = await this.checkStockPlateQuotes(runDate);

    if (hasStockPlateQuotes) {
      this.logger.log("stock plate quotes available! No need to fetch.");
      return;
    }

    await this.getStockPlateQuotes(runDate);
  }
}
