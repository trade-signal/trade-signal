import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { getRunDate } from "@trade-signal/shared";
import { PrismaService } from "src/common/database/prisma.service";
import { EastMoneyStockService } from "./providers/eastmoney/stock.service";

@Injectable()
export class StockService implements OnModuleInit {
  private readonly logger = new Logger(StockService.name);

  private readonly BATCH_SIZE = 200;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eastMoneyStockService: EastMoneyStockService
  ) {}

  // 初始化股票数据
  async onModuleInit() {
    try {
      this.logger.log("Initializing stock data...");

      await Promise.all([
        this.initStockBasic(),
        this.initStockQuotes(),
        this.initStockScreener()
      ]);

      this.logger.log("Stock data initialization completed");
    } catch (error) {
      this.logger.error(`Stock data initialization failed: ${error}`);
    }
  }

  // 收盘后运行：16:00
  @Cron("0 16 * * 1-5")
  async dailyUpdateHandle() {
    await this.getStockQuotes();
    await this.getStockScreener();
  }

  // 每天清晨 5:30 清理数据（在开盘前）
  @Cron("30 5 * * *")
  async dailyCleanHandle() {
    await this.cleanStockQuotes();
    await this.cleanStockScreener();
  }

  // 每月1号运行：更新所有股票的基本信息
  @Cron("0 0 1 * *")
  async monthlyUpdateHandle() {
    await this.getStockBasic();
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
}
