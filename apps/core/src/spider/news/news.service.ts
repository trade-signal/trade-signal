import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor() {}

  async getNews() {
    this.logger.log("getNews");
  }
}
