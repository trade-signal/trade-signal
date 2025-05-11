import { Injectable, Logger } from "@nestjs/common";
import dayjs from "dayjs";

import { getStockBasic, getStockQuotes } from "src/spider/api/eastmoney.stock";
import {
  quotesBaseIndicatorMapping,
  quotesIndicatorMapping
} from "src/spider/api/eastmoney.stock.indicator";
import { getStockScreener } from "src/spider/api/eastmoney.screener";
import { selectionIndicatorMapping } from "src/spider/api/eastmoney.screener.indicator";

import { getIndicatorFields, transformStockData } from "src/utils/tools";

@Injectable()
export class EastMoneyStockService {
  private readonly logger = new Logger(EastMoneyStockService.name);

  async getStockBasic() {
    this.logger.debug("开始获取股票基本信息");

    const data = await getStockBasic({
      fields: getIndicatorFields(quotesBaseIndicatorMapping)
    });

    if (data.length === 0) {
      this.logger.error("获取股票基本信息失败");
      return [];
    }

    let list = transformStockData(data, quotesBaseIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => item.newPrice > 0);

    this.logger.debug(`获取股票基本信息成功，共${list.length}条`);

    return list;
  }

  async getStockQuotes(date?: string) {
    this.logger.debug("开始获取股票行情信息");

    const currentDate = dayjs(date).format("YYYY-MM-DD");

    const data = await getStockQuotes({
      fields: getIndicatorFields(quotesIndicatorMapping)
    });

    if (data.length === 0) {
      this.logger.error("获取股票行情信息失败");
      return [];
    }

    let list = transformStockData(data, quotesIndicatorMapping);
    // newPrice > 0, 过滤掉停牌的股票
    list = list.filter(item => Number(item.newPrice) > 0);
    // 添加日期
    list = list.map(item => ({
      ...item,
      date: currentDate
    }));

    this.logger.debug(`获取股票行情信息成功，共${list.length}条`);

    return list;
  }

  async getStockScreener() {
    this.logger.debug("开始获取股票筛选器信息");

    let page = 1;
    let pageSize = 1000;

    const result = [];

    while (true) {
      try {
        const response = await getStockScreener(page, pageSize);

        if (!response.success) {
          this.logger.error("获取股票筛选器信息失败");
          return [];
        }

        const { count, data } = response.result;

        const list = transformStockData(data, selectionIndicatorMapping);

        result.push(...list);

        if (!count || page * pageSize >= count) break;

        page++;
      } catch (error) {
        this.logger.error(`获取股票筛选器信息失败: ${error}`);
        break;
      }
    }

    this.logger.debug(`获取股票筛选器信息成功，共${result.length}条`);

    return result;
  }
}
