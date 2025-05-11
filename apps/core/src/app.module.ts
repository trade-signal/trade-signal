import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { StockModule } from "./spider/stock/stock.module";

@Module({
  imports: [ScheduleModule.forRoot(), StockModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
