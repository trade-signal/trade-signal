import { IndicatorType } from "@/cron/type";
import {
  renderDownNumber,
  renderNumber,
  renderPercent,
  renderUpNumber
} from "@/shared/renders";
import {
  formatBillion,
  formatNumber,
  formatLargeNumber,
  formatPercent
} from "@/shared/formatters";

// 基本信息指标
const basicIndicators = {
  code: {
    type: IndicatorType.STRING,
    cn: "代码",
    map: "f12",
    formatter: (v: any) => v
  },
  name: {
    type: IndicatorType.STRING,
    cn: "名称",
    map: "f14",
    formatter: (v: any) => v
  }
};

// 价格相关指标
const priceIndicators = {
  newPrice: {
    type: IndicatorType.NUMBER,
    cn: "最新价",
    map: "f2",
    formatter: renderNumber
  },
  changeRate: {
    type: IndicatorType.NUMBER,
    cn: "涨跌幅",
    map: "f3",
    formatter: renderPercent
  },
  upsDowns: {
    type: IndicatorType.NUMBER,
    cn: "涨跌额",
    map: "f4",
    formatter: renderNumber
  }
};

// 交易指标
const tradingIndicators = {
  volume: {
    type: IndicatorType.NUMBER,
    cn: "成交量",
    map: "f5",
    formatter: formatLargeNumber
  },
  dealAmount: {
    type: IndicatorType.NUMBER,
    cn: "成交额",
    map: "f6",
    formatter: formatLargeNumber
  },
  amplitude: {
    type: IndicatorType.NUMBER,
    cn: "振幅",
    map: "f7",
    formatter: renderPercent
  },
  turnoverRate: {
    type: IndicatorType.NUMBER,
    cn: "换手率",
    map: "f8",
    formatter: renderPercent
  },
  volumeRatio: {
    type: IndicatorType.NUMBER,
    cn: "量比",
    map: "f10",
    formatter: formatNumber
  },
  openPrice: {
    type: IndicatorType.NUMBER,
    cn: "今开",
    map: "f17",
    formatter: formatNumber
  },
  highPrice: {
    type: IndicatorType.NUMBER,
    cn: "最高",
    map: "f15",
    formatter: formatNumber
  },
  lowPrice: {
    type: IndicatorType.NUMBER,
    cn: "最低",
    map: "f16",
    formatter: formatNumber
  },
  preClosePrice: {
    type: IndicatorType.NUMBER,
    cn: "昨收",
    map: "f18",
    formatter: formatNumber
  }
};

// 涨跌速度指标
const speedIndicators = {
  speedIncrease: {
    type: IndicatorType.NUMBER,
    cn: "涨速",
    map: "f22",
    formatter: renderPercent
  },
  speedIncrease5: {
    type: IndicatorType.NUMBER,
    cn: "5分钟涨跌",
    map: "f11",
    formatter: renderPercent
  },
  speedIncrease60: {
    type: IndicatorType.NUMBER,
    cn: "60日涨跌幅",
    map: "f24",
    formatter: renderPercent
  },
  speedIncreaseAll: {
    type: IndicatorType.NUMBER,
    cn: "年初至今涨跌幅",
    map: "f25",
    formatter: renderPercent
  }
};

// 估值指标
const valuationIndicators = {
  dtsyl: {
    type: IndicatorType.NUMBER,
    cn: "市盈率动",
    map: "f9",
    formatter: formatNumber
  },
  pe9: {
    type: IndicatorType.NUMBER,
    cn: "市盈率TTM",
    map: "f115",
    formatter: formatNumber
  },
  pe: {
    type: IndicatorType.NUMBER,
    cn: "市盈率静",
    map: "f114",
    formatter: formatNumber
  },
  pbnewmrq: {
    type: IndicatorType.NUMBER,
    cn: "市净率",
    map: "f23",
    formatter: formatNumber
  },
  basicEps: {
    type: IndicatorType.NUMBER,
    cn: "每股收益",
    map: "f112",
    formatter: formatNumber
  },
  bvps: {
    type: IndicatorType.NUMBER,
    cn: "每股净资产",
    map: "f113",
    formatter: formatNumber
  },
  perCapitalReserve: {
    type: IndicatorType.NUMBER,
    cn: "每股公积金",
    map: "f61",
    formatter: formatNumber
  },
  perUnassignProfit: {
    type: IndicatorType.NUMBER,
    cn: "每股未分配利润",
    map: "f48",
    formatter: formatNumber
  }
};

// 财务指标
const financialIndicators = {
  roeWeight: {
    type: IndicatorType.NUMBER,
    cn: "加权净资产收益率",
    map: "f37",
    formatter: formatPercent
  },
  saleGpr: {
    type: IndicatorType.NUMBER,
    cn: "毛利率",
    map: "f49",
    formatter: formatPercent
  },
  debtAssetRatio: {
    type: IndicatorType.NUMBER,
    cn: "资产负债率",
    map: "f57",
    formatter: formatPercent
  },
  totalOperateIncome: {
    type: IndicatorType.NUMBER,
    cn: "营业收入",
    map: "f40",
    formatter: formatBillion
  },
  toiYoyRatio: {
    type: IndicatorType.NUMBER,
    cn: "营业收入同比增长",
    map: "f41",
    formatter: renderPercent
  },
  parentNetprofit: {
    type: IndicatorType.NUMBER,
    cn: "归属净利润",
    map: "f45",
    formatter: formatBillion
  },
  netprofitYoyRatio: {
    type: IndicatorType.NUMBER,
    cn: "归属净利润同比增长",
    map: "f46",
    formatter: renderPercent
  }
};

// 股本及市值指标
const sharesAndCapIndicators = {
  totalShares: {
    type: IndicatorType.NUMBER,
    cn: "总股本",
    map: "f38",
    formatter: formatLargeNumber
  },
  freeShares: {
    type: IndicatorType.NUMBER,
    cn: "已流通股份",
    map: "f39",
    formatter: formatLargeNumber
  },
  totalMarketCap: {
    type: IndicatorType.NUMBER,
    cn: "总市值",
    map: "f20",
    formatter: formatLargeNumber
  },
  freeCap: {
    type: IndicatorType.NUMBER,
    cn: "流通市值",
    map: "f21",
    formatter: formatLargeNumber
  }
};

// 其他指标
const otherIndicators = {
  industry: {
    type: IndicatorType.STRING,
    cn: "所处行业",
    map: "f100",
    formatter: (v: any) => v
  },
  listingDate: {
    type: IndicatorType.DATE,
    cn: "上市时间",
    map: "f26",
    formatter: (v: any) => v
  },
  reportDate: {
    type: IndicatorType.DATE,
    cn: "报告期",
    map: "f221",
    formatter: (v: any) => v
  }
};

// --------------------------------------------------------------

// 个股指标 - 基础
export const quotesBaseIndicatorMapping = {
  ...basicIndicators,
  newPrice: priceIndicators.newPrice,
  industry: otherIndicators.industry,
  listingDate: otherIndicators.listingDate,
  marketId: {
    type: IndicatorType.NUMBER,
    cn: "市场ID",
    map: "f13",
    formatter: (v: any) => v
  }
};

// 指数指标 - 基础
export const quotesIndexBaseIndicatorMapping = {
  ...basicIndicators,
  marketId: {
    type: IndicatorType.NUMBER,
    cn: "市场ID",
    map: "f13",
    formatter: (v: any) => v
  }
};

// 板块指标 - 基础
export const quotesPlateBaseIndicatorMapping = {
  ...basicIndicators,
  marketId: {
    type: IndicatorType.NUMBER,
    cn: "市场ID",
    map: "f13",
    formatter: (v: any) => v
  }
};

// 个股指标 - 实时行情
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

// 指数指标 - 实时行情
export const quotesIndexIndicatorMapping = {
  ...basicIndicators,
  ...priceIndicators,
  ...tradingIndicators
};

// 板块指标 - 实时行情
export const quotesPlateIndicatorMapping = {
  ...basicIndicators,
  ...priceIndicators,

  // 交易相关指标
  volume: tradingIndicators.volume,
  dealAmount: tradingIndicators.dealAmount,
  turnoverRate: tradingIndicators.turnoverRate,
  totalMarketCap: sharesAndCapIndicators.totalMarketCap,

  // 成分股统计
  upCount: {
    type: IndicatorType.NUMBER,
    cn: "上涨家数",
    map: "f104",
    formatter: renderUpNumber
  },
  downCount: {
    type: IndicatorType.NUMBER,
    cn: "下跌家数",
    map: "f105",
    formatter: renderDownNumber
  },

  // 领涨领跌信息
  topGainerName: {
    type: IndicatorType.STRING,
    cn: "领涨股",
    map: "f128",
    formatter: (v: any) => v
  },
  topGainerCode: {
    type: IndicatorType.STRING,
    cn: "领涨股Code",
    map: "f140",
    formatter: (v: any) => v
  },
  topLoserName: {
    type: IndicatorType.STRING,
    cn: "领跌股",
    map: "f207",
    formatter: (v: any) => v
  },
  topLoserCode: {
    type: IndicatorType.STRING,
    cn: "领跌股Code",
    map: "f208",
    formatter: (v: any) => v
  }
};
