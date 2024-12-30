import { IndicatorMapping } from "../type";

// 交易指标
export const quotesDailyIndicatorMapping: IndicatorMapping = {
  // 基本信息
  code: {
    type: "string",
    cn: "代码",
    map: "f12"
  },
  name: {
    type: "string",
    cn: "名称",
    map: "f14"
  },

  // 核心价格指标（OHLC）
  openPrice: {
    type: "number",
    cn: "开盘价",
    map: "f17"
  },
  highPrice: {
    type: "number",
    cn: "最高价",
    map: "f15"
  },
  lowPrice: {
    type: "number",
    cn: "最低价",
    map: "f16"
  },
  closePrice: {
    type: "number",
    cn: "收盘价",
    map: "f18"
  },

  // 成交指标
  volume: {
    type: "number",
    cn: "成交量",
    map: "f5"
  },
  dealAmount: {
    type: "number",
    cn: "成交额",
    map: "f6"
  }
};
