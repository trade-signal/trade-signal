import { Injectable, Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { getTradeDate } from "src/spider/api/trade.sina";

@Injectable()
export class TradeService {
  private readonly logger = new Logger(TradeService.name);

  private tradeDates: string[] = [];

  async initTradeDates() {
    if (this.tradeDates.length > 0) return;
    const dates = await getTradeDate();
    this.tradeDates = dates;
  }

  async getTradeDates() {
    if (this.tradeDates.length === 0) {
      await this.initTradeDates();
    }
    return this.tradeDates;
  }

  async clearTradeDates() {
    this.tradeDates = [];
  }

  async refreshTradeDates() {
    try {
      this.logger.debug("refresh trade dates");
      await this.clearTradeDates();
      await this.initTradeDates();
      this.logger.debug("refresh trade dates success");
    } catch (error) {
      this.logger.error(`refresh trade dates error: ${error}`);
    }
  }

  async isTradeDate(date: string) {
    const tradeDate = dayjs(date).format("YYYY-MM-DD");
    return this.tradeDates.includes(tradeDate);
  }
}
