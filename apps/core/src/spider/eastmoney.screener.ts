import { get } from '@/packages/shared/request';
import { createLogger, getIndicatorFields } from '@/apps/core/cron/util';
import { selectionIndicatorMapping } from './eastmoney.screener.indicator';

const spider_name = 'eastmoney.selection';
const print = createLogger(spider_name, 'stock');

/**
 * 选股指标
 *
 * 东方财富网-个股-选股器
 * https://data.eastmoney.com/xuangu/
 *
 * @param page 页码
 * @param pageSize 每页数量
 */
export const getStockScreener = async (page: number, pageSize: number) => {
  try {
    const url = `https://data.eastmoney.com/dataapi/xuangu/list`;

    // 选股指标 初始值 "SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,CHANGE_RATE"
    const sty = getIndicatorFields(selectionIndicatorMapping);

    // 过滤条件
    // const filter = `(MARKET+in+("上交所主板","深交所主板","深交所创业板","上交所科创板","上交所风险警示板","深交所风险警示板","北京证券交易所"))(NEW_PRICE>0)`;
    const filter = `(MARKET+in+("上交所主板","深交所主板","深交所创业板","上交所科创板"))(NEW_PRICE>0)`;

    const response = await get(url, {
      sty,
      filter: filter,
      p: page,
      ps: pageSize,
      source: 'SELECT_SECURITIES',
      client: 'WEB',
    });

    return response;
  } catch (error) {
    print(`get ${spider_name} stock screener error: ${error}`);
    return [];
  }
};
