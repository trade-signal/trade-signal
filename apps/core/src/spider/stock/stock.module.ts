import { Module } from "@nestjs/common";

import { PrismaService } from "src/common/database/prisma.service";

import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";
import { EastMoneyStockService } from "./providers/eastmoney/stock.service";

@Module({
  imports: [],
  providers: [StockService, PrismaService, EastMoneyStockService],
  exports: [StockService],
  controllers: [StockController]
})
export class StockModule {}
