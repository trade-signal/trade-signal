import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { StockModule } from "./spider/stock/stock.module";
import { NewsModule } from "./spider/news/news.module";

@Module({
  imports: [ScheduleModule.forRoot(), StockModule, NewsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
