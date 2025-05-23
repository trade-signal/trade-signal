import { Injectable, Logger } from "@nestjs/common";
import dayjs from "dayjs";

import {
  getStockPlateBasic,
  getStockPlateQuotes
} from "src/crawler/api/eastmoney.stock";
import {
  quotesPlateBaseIndicatorMapping,
  quotesPlateIndicatorMapping
} from "src/crawler/api/eastmoney.stock.indicator";
import { getIndicatorFields, transformStockData } from "src/utils/tools";

@Injectable()
export class EastMoneyStockPlateService {
  private readonly logger = new Logger(EastMoneyStockPlateService.name);

  async getStockPlateBasic() {
    this.logger.debug("开始获取沪深京板块基本信息");

    const data = await getStockPlateBasic({
      fields: getIndicatorFields(quotesPlateBaseIndicatorMapping)
    });

    if (data.length === 0) {
      this.logger.error("获取沪深京板块基本信息失败");
      return [];
    }

    const list = transformStockData(data, quotesPlateBaseIndicatorMapping);

    this.logger.debug(`获取沪深京板块基本信息成功，共${list.length}条`);

    return list;
  }

  async getStockPlateQuotes(date?: string) {
    this.logger.debug("开始获取沪深京板块行情信息");

    const currentDate = dayjs(date).format("YYYY-MM-DD");

    const data = await getStockPlateQuotes({
      fields: getIndicatorFields(quotesPlateIndicatorMapping)
    });

    if (data.length === 0) {
      this.logger.error("获取沪深京板块行情信息失败");
      return [];
    }

    let list = transformStockData(data, quotesPlateIndicatorMapping);
    // 添加日期
    list = list.map(item => ({
      ...item,
      date: currentDate
    }));

    this.logger.debug(`获取沪深京板块行情信息成功，共${list.length}条`);

    return list;
  }
}
