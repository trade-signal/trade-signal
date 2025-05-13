import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { StockModule } from "./spider/stock/stock.module";
import { NewsModule } from "./spider/news/news.module";

@Module({
  imports: [ScheduleModule.forRoot(), StockModule, NewsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
