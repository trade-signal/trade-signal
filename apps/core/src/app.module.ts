import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { NewsModule } from "./spider/news/news.module";

@Module({
  imports: [ScheduleModule.forRoot(), NewsModule]
})
export class AppModule {}
