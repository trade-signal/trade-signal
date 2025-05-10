import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import { getTradeDate } from "src/api/trade.sina";

@Injectable()
export class TradeService {
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

  async isTradeDate(date: string) {
    const tradeDate = dayjs(date).format("YYYY-MM-DD");
    return this.tradeDates.includes(tradeDate);
  }
}
