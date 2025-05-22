import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "src/common/database/prisma.service";

import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";
import { EastMoneyStockService } from "./providers/eastmoney/stock.service";
import { EastMoneyStockPlateService } from "./providers/eastmoney/stock-plate.service";

@Module({
  imports: [ConfigModule],
  providers: [
    StockService,
    PrismaService,
    EastMoneyStockPlateService,
    EastMoneyStockService
  ],
  exports: [StockService],
  controllers: [StockController]
})
export class StockModule {}
