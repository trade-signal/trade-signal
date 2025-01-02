import { IndicatorType } from "../../type";

// 基本信息指标
const basicIndicators = {
  code: { type: IndicatorType.STRING, cn: "代码", map: "f12" },
  name: { type: IndicatorType.STRING, cn: "名称", map: "f14" }
};

// 价格相关指标
const priceIndicators = {
  newPrice: { type: IndicatorType.NUMBER, cn: "最新价", map: "f2" },
  changeRate: { type: IndicatorType.NUMBER, cn: "涨跌幅", map: "f3" },
  upsDowns: { type: IndicatorType.NUMBER, cn: "涨跌额", map: "f4" }
};

// 交易指标
const tradingIndicators = {
  volume: { type: IndicatorType.NUMBER, cn: "成交量", map: "f5" },
  dealAmount: { type: IndicatorType.NUMBER, cn: "成交额", map: "f6" },
  amplitude: { type: IndicatorType.NUMBER, cn: "振幅", map: "f7" },
  turnoverRate: { type: IndicatorType.NUMBER, cn: "换手率", map: "f8" },
  volumeRatio: { type: IndicatorType.NUMBER, cn: "量比", map: "f10" },
  openPrice: { type: IndicatorType.NUMBER, cn: "今开", map: "f17" },
  highPrice: { type: IndicatorType.NUMBER, cn: "最高", map: "f15" },
  lowPrice: { type: IndicatorType.NUMBER, cn: "最低", map: "f16" },
  preClosePrice: { type: IndicatorType.NUMBER, cn: "昨收", map: "f18" }
};

// 涨跌速度指标
const speedIndicators = {
  speedIncrease: { type: IndicatorType.NUMBER, cn: "涨速", map: "f22" },
  speedIncrease5: { type: IndicatorType.NUMBER, cn: "5分钟涨跌", map: "f11" },
  speedIncrease60: { type: IndicatorType.NUMBER, cn: "60日涨跌幅", map: "f24" },
  speedIncreaseAll: {
    type: IndicatorType.NUMBER,
    cn: "年初至今涨跌幅",
    map: "f25"
  }
};

// 估值指标
const valuationIndicators = {
  dtsyl: { type: IndicatorType.NUMBER, cn: "市盈率动", map: "f9" },
  pe9: { type: IndicatorType.NUMBER, cn: "市盈率TTM", map: "f115" },
  pe: { type: IndicatorType.NUMBER, cn: "市盈率静", map: "f114" },
  pbnewmrq: { type: IndicatorType.NUMBER, cn: "市净率", map: "f23" },
  basicEps: { type: IndicatorType.NUMBER, cn: "每股收益", map: "f112" },
  bvps: { type: IndicatorType.NUMBER, cn: "每股净资产", map: "f113" },
  perCapitalReserve: {
    type: IndicatorType.NUMBER,
    cn: "每股公积金",
    map: "f61"
  },
  perUnassignProfit: {
    type: IndicatorType.NUMBER,
    cn: "每股未分配利润",
    map: "f48"
  }
};

// 财务指标
const financialIndicators = {
  roeWeight: { type: IndicatorType.NUMBER, cn: "加权净资产收益率", map: "f37" },
  saleGpr: { type: IndicatorType.NUMBER, cn: "毛利率", map: "f49" },
  debtAssetRatio: { type: IndicatorType.NUMBER, cn: "资产负债率", map: "f57" },
  totalOperateIncome: {
    type: IndicatorType.NUMBER,
    cn: "营业收入",
    map: "f40"
  },
  toiYoyRatio: {
    type: IndicatorType.NUMBER,
    cn: "营业收入同比增长",
    map: "f41"
  },
  parentNetprofit: { type: IndicatorType.NUMBER, cn: "归属净利润", map: "f45" },
  netprofitYoyRatio: {
    type: IndicatorType.NUMBER,
    cn: "归属净利润同比增长",
    map: "f46"
  }
};

// 股本及市值指标
const sharesAndCapIndicators = {
  totalShares: { type: IndicatorType.NUMBER, cn: "总股本", map: "f38" },
  freeShares: { type: IndicatorType.NUMBER, cn: "已流通股份", map: "f39" },
  totalMarketCap: { type: IndicatorType.NUMBER, cn: "总市值", map: "f20" },
  freeCap: { type: IndicatorType.NUMBER, cn: "流通市值", map: "f21" }
};

// 其他指标
const otherIndicators = {
  industry: { type: IndicatorType.STRING, cn: "所处行业", map: "f100" },
  listingDate: { type: IndicatorType.DATE, cn: "上市时间", map: "f26" },
  reportDate: { type: IndicatorType.DATE, cn: "报告期", map: "f221" }
};

// 股票指标 - 基础
export const quotesBaseIndicatorMapping = {
  ...basicIndicators,
  newPrice: priceIndicators.newPrice,
  ...otherIndicators
};

// 股票指标 - 日线
export const quotesDailyIndicatorMapping = {
  ...basicIndicators,
  ...priceIndicators,
  ...tradingIndicators
};

// 股票指标 - 指数
export const quotesIndexIndicatorMapping = {
  ...basicIndicators,
  ...priceIndicators,
  ...tradingIndicators
};

// 股票指标 - 实时
export const quotesIndicatorMapping = {
  ...basicIndicators,
  ...priceIndicators,
  ...tradingIndicators,
  ...speedIndicators,
  ...valuationIndicators,
  ...financialIndicators,
  ...sharesAndCapIndicators,
  ...otherIndicators
};
