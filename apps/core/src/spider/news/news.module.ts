import { Module } from "@nestjs/common";

import { PrismaService } from "../../common/database/prisma.service";
import { SinaService } from "./providers/sina/sina.service";
import { ClsService } from "./providers/cls/cls.service";

import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";

@Module({
  imports: [],
  providers: [NewsService, PrismaService, SinaService, ClsService],
  exports: [NewsService],
  controllers: [NewsController]
})
export class NewsModule {}
