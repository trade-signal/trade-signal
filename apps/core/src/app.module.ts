import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";

import configuration from "./common/configuration";

import { StockModule } from "./crawler/stock/stock.module";
import { NewsModule } from "./crawler/news/news.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    ScheduleModule.forRoot(),
    StockModule,
    NewsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
