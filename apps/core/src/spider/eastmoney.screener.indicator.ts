import { IndicatorType } from "@trade-signal/types";

// 基本信息指标
export const basicIndicatorMapping = {
  date: {
    type: IndicatorType.DATE,
    cn: "交易日期",
    map: "MAX_TRADE_DATE"
  },
  code: {
    type: IndicatorType.STRING,
    cn: "股票代码",
    map: "SECURITY_CODE"
  },
  name: {
    type: IndicatorType.STRING,
    cn: "股票名称",
    map: "SECURITY_NAME_ABBR"
  },
  secucode: {
    type: IndicatorType.STRING,
    cn: "全代码",
    map: "SECUCODE"
  }
};

// 交易数据指标
export const tradeIndicatorMapping = {
  newPrice: {
    type: IndicatorType.NUMBER,
    cn: "最新价",
    map: "NEW_PRICE"
  },
  changeRate: {
    type: IndicatorType.NUMBER,
    cn: "涨跌幅",
    map: "CHANGE_RATE"
  },
  volumeRatio: {
    type: IndicatorType.NUMBER,
    cn: "量比",
    map: "VOLUME_RATIO"
  },
  highPrice: {
    type: IndicatorType.NUMBER,
    cn: "最高价",
    map: "HIGH_PRICE"
  },
  lowPrice: {
    type: IndicatorType.NUMBER,
    cn: "最低价",
    map: "LOW_PRICE"
  },
  preClosePrice: {
    type: IndicatorType.NUMBER,
    cn: "昨收价",
    map: "PRE_CLOSE_PRICE"
  },
  volume: {
    type: IndicatorType.NUMBER,
    cn: "成交量",
    map: "VOLUME"
  },
  dealAmount: {
    type: IndicatorType.NUMBER,
    cn: "成交额",
    map: "DEAL_AMOUNT"
  },
  turnoverRate: {
    type: IndicatorType.NUMBER,
    cn: "换手率",
    map: "TURNOVERRATE"
  },
  amplitude: {
    type: IndicatorType.NUMBER,
    cn: "振幅",
    map: "AMPLITUDE"
  }
};

// 公司信息指标
export const companyIndicatorMapping = {
  listingDate: {
    type: IndicatorType.DATE,
    cn: "上市日期",
    map: "LISTING_DATE"
  },
  industry: {
    type: IndicatorType.STRING,
    cn: "行业",
    map: "INDUSTRY"
  },
  area: {
    type: IndicatorType.STRING,
    cn: "地区",
    map: "AREA"
  },
  concept: {
    type: IndicatorType.ARRAY,
    cn: "概念",
    map: "CONCEPT"
  },
  style: {
    type: IndicatorType.ARRAY,
    cn: "风格",
    map: "STYLE"
  }
};

// 指数成分指标
export const indexComponentMapping = {
  isHs300: {
    type: IndicatorType.BOOLEAN,
    cn: "沪深300",
    map: "IS_HS300"
  },
  isSz50: {
    type: IndicatorType.BOOLEAN,
    cn: "上证50",
    map: "IS_SZ50"
  },
  isZz500: {
    type: IndicatorType.BOOLEAN,
    cn: "中证500",
    map: "IS_ZZ500"
  },
  isZz1000: {
    type: IndicatorType.BOOLEAN,
    cn: "中证1000",
    map: "IS_ZZ1000"
  },
  isCy50: {
    type: IndicatorType.BOOLEAN,
    cn: "创业板50",
    map: "IS_CY50"
  }
};

// 估值指标
export const valuationIndicatorMapping = {
  pe9: {
    type: IndicatorType.NUMBER,
    cn: "市盈率TTM",
    map: "PE9"
  },
  pbnewmrq: {
    type: IndicatorType.NUMBER,
    cn: "市净率MRQ",
    map: "PBNEWMRQ"
  },
  pettmdeducted: {
    type: IndicatorType.NUMBER,
    cn: "市盈率TTM扣非",
    map: "PETTMDEDUCTED"
  },
  ps9: {
    type: IndicatorType.NUMBER,
    cn: "市销率TTM",
    map: "PS9"
  },
  pcfjyxjl9: {
    type: IndicatorType.NUMBER,
    cn: "市现率TTM",
    map: "PCFJYXJL9"
  },
  predictPeSyear: {
    type: IndicatorType.NUMBER,
    cn: "预测市盈率今年",
    map: "PREDICT_PE_SYEAR"
  },
  predictPeNyear: {
    type: IndicatorType.NUMBER,
    cn: "预测市盈率明年",
    map: "PREDICT_PE_NYEAR"
  },
  totalMarketCap: {
    type: IndicatorType.NUMBER,
    cn: "总市值",
    map: "TOTAL_MARKET_CAP"
  },
  freeCap: {
    type: IndicatorType.NUMBER,
    cn: "流通市值",
    map: "FREE_CAP"
  },
  dtsyl: {
    type: IndicatorType.NUMBER,
    cn: "动态市盈率",
    map: "DTSYL"
  },
  ycpeg: {
    type: IndicatorType.NUMBER,
    cn: "预测PEG",
    map: "YCPEG"
  },
  enterpriseValueMultiple: {
    type: IndicatorType.NUMBER,
    cn: "企业价值倍数",
    map: "ENTERPRISE_VALUE_MULTIPLE"
  }
};

// 每股指标
export const perShareIndicatorMapping = {
  basicEps: {
    type: IndicatorType.NUMBER,
    cn: "每股收益",
    map: "BASIC_EPS"
  },
  bvps: {
    type: IndicatorType.NUMBER,
    cn: "每股净资产",
    map: "BVPS"
  },
  perNetcashOperate: {
    type: IndicatorType.NUMBER,
    cn: "每股经营现金流",
    map: "PER_NETCASH_OPERATE"
  },
  perFcfe: {
    type: IndicatorType.NUMBER,
    cn: "每股自由现金流",
    map: "PER_FCFE"
  },
  perCapitalReserve: {
    type: IndicatorType.NUMBER,
    cn: "每股资本公积",
    map: "PER_CAPITAL_RESERVE"
  },
  perUnassignProfit: {
    type: IndicatorType.NUMBER,
    cn: "每股未分配利润",
    map: "PER_UNASSIGN_PROFIT"
  },
  perSurplusReserve: {
    type: IndicatorType.NUMBER,
    cn: "每股盈余公积",
    map: "PER_SURPLUS_RESERVE"
  },
  perRetainedEarning: {
    type: IndicatorType.NUMBER,
    cn: "每股留存收益",
    map: "PER_RETAINED_EARNING"
  }
};

// 财务指标
export const financialIndicatorMapping = {
  parentNetprofit: {
    type: IndicatorType.NUMBER,
    cn: "归属净利润",
    map: "PARENT_NETPROFIT"
  },
  deductNetprofit: {
    type: IndicatorType.NUMBER,
    cn: "扣非净利润",
    map: "DEDUCT_NETPROFIT"
  },
  totalOperateIncome: {
    type: IndicatorType.NUMBER,
    cn: "营业总收入",
    map: "TOTAL_OPERATE_INCOME"
  },
  roeWeight: {
    type: IndicatorType.NUMBER,
    cn: "净资产收益率ROE",
    map: "ROE_WEIGHT"
  },
  jroa: {
    type: IndicatorType.NUMBER,
    cn: "总资产净利率ROA",
    map: "JROA"
  },
  roic: {
    type: IndicatorType.NUMBER,
    cn: "投入资本回报率ROIC",
    map: "ROIC"
  },
  zxgxl: {
    type: IndicatorType.NUMBER,
    cn: "最新股息率",
    map: "ZXGXL"
  },
  saleGpr: {
    type: IndicatorType.NUMBER,
    cn: "毛利率",
    map: "SALE_GPR"
  },
  saleNpr: {
    type: IndicatorType.NUMBER,
    cn: "净利率",
    map: "SALE_NPR"
  }
};

// 增长指标
export const growthIndicatorMapping = {
  netprofitYoyRatio: {
    type: IndicatorType.NUMBER,
    cn: "净利润增长率",
    map: "NETPROFIT_YOY_RATIO"
  },
  deductNetprofitGrowthrate: {
    type: IndicatorType.NUMBER,
    cn: "扣非净利润增长率",
    map: "DEDUCT_NETPROFIT_GROWTHRATE"
  },
  toiYoyRatio: {
    type: IndicatorType.NUMBER,
    cn: "营收增长率",
    map: "TOI_YOY_RATIO"
  },
  netprofitGrowthrate3y: {
    type: IndicatorType.NUMBER,
    cn: "净利润3年复合增长率",
    map: "NETPROFIT_GROWTHRATE_3Y"
  },
  incomeGrowthrate3y: {
    type: IndicatorType.NUMBER,
    cn: "营收3年复合增长率",
    map: "INCOME_GROWTHRATE_3Y"
  },
  predictNetprofitRatio: {
    type: IndicatorType.NUMBER,
    cn: "预测净利润同比增长",
    map: "PREDICT_NETPROFIT_RATIO"
  },
  predictIncomeRatio: {
    type: IndicatorType.NUMBER,
    cn: "预测营收同比增长",
    map: "PREDICT_INCOME_RATIO"
  },
  basicepsYoyRatio: {
    type: IndicatorType.NUMBER,
    cn: "每股收益同比增长率",
    map: "BASICEPS_YOY_RATIO"
  },
  totalProfitGrowthrate: {
    type: IndicatorType.NUMBER,
    cn: "利润总额同比增长率",
    map: "TOTAL_PROFIT_GROWTHRATE"
  },
  operateProfitGrowthrate: {
    type: IndicatorType.NUMBER,
    cn: "营业利润同比增长率",
    map: "OPERATE_PROFIT_GROWTHRATE"
  }
};

// 资产负债指标
export const balanceSheetIndicatorMapping = {
  debtAssetRatio: {
    type: IndicatorType.NUMBER,
    cn: "资产负债率",
    map: "DEBT_ASSET_RATIO"
  },
  equityRatio: {
    type: IndicatorType.NUMBER,
    cn: "产权比率",
    map: "EQUITY_RATIO"
  },
  equityMultiplier: {
    type: IndicatorType.NUMBER,
    cn: "权益乘数",
    map: "EQUITY_MULTIPLIER"
  },
  currentRatio: {
    type: IndicatorType.NUMBER,
    cn: "流动比率",
    map: "CURRENT_RATIO"
  },
  speedRatio: {
    type: IndicatorType.NUMBER,
    cn: "速动比率",
    map: "SPEED_RATIO"
  }
};

// 股本结构指标
export const shareStructureIndicatorMapping = {
  totalShares: {
    type: IndicatorType.NUMBER,
    cn: "总股本",
    map: "TOTAL_SHARES"
  },
  freeShares: {
    type: IndicatorType.NUMBER,
    cn: "流通股本",
    map: "FREE_SHARES"
  },
  holderNewest: {
    type: IndicatorType.NUMBER,
    cn: "最新股东户数",
    map: "HOLDER_NEWEST"
  },
  holderRatio: {
    type: IndicatorType.NUMBER,
    cn: "股东户数增长率",
    map: "HOLDER_RATIO"
  },
  holdAmount: {
    type: IndicatorType.NUMBER,
    cn: "户均持股金额",
    map: "HOLD_AMOUNT"
  },
  avgHoldNum: {
    type: IndicatorType.NUMBER,
    cn: "户均持股数量",
    map: "AVG_HOLD_NUM"
  },
  holdnumGrowthrate3q: {
    type: IndicatorType.NUMBER,
    cn: "户均持股数季度增长率",
    map: "HOLDNUM_GROWTHRATE_3Q"
  },
  holdnumGrowthrateHy: {
    type: IndicatorType.NUMBER,
    cn: "户均持股数半年增长率",
    map: "HOLDNUM_GROWTHRATE_HY"
  },
  holdRatioCount: {
    type: IndicatorType.NUMBER,
    cn: "十大股东持股比例合计",
    map: "HOLD_RATIO_COUNT"
  },
  freeHoldRatio: {
    type: IndicatorType.NUMBER,
    cn: "十大流通股东比例合计",
    map: "FREE_HOLD_RATIO"
  }
};

// 技术指标
export const technicalIndicatorMapping = {
  macdGoldenFork: {
    type: IndicatorType.BOOLEAN,
    cn: "MACD金叉日线",
    map: "MACD_GOLDEN_FORK"
  },
  macdGoldenForkz: {
    type: IndicatorType.BOOLEAN,
    cn: "MACD金叉周线",
    map: "MACD_GOLDEN_FORKZ"
  },
  macdGoldenForky: {
    type: IndicatorType.BOOLEAN,
    cn: "MACD金叉月线",
    map: "MACD_GOLDEN_FORKY"
  },
  kdjGoldenFork: {
    type: IndicatorType.BOOLEAN,
    cn: "KDJ金叉日线",
    map: "KDJ_GOLDEN_FORK"
  },
  kdjGoldenForkz: {
    type: IndicatorType.BOOLEAN,
    cn: "KDJ金叉周线",
    map: "KDJ_GOLDEN_FORKZ"
  },
  kdjGoldenForky: {
    type: IndicatorType.BOOLEAN,
    cn: "KDJ金叉月线",
    map: "KDJ_GOLDEN_FORKY"
  },
  breakThrough: {
    type: IndicatorType.BOOLEAN,
    cn: "放量突破",
    map: "BREAK_THROUGH"
  },
  lowFundsInflow: {
    type: IndicatorType.BOOLEAN,
    cn: "低位资金净流入",
    map: "LOW_FUNDS_INFLOW"
  },
  highFundsOutflow: {
    type: IndicatorType.BOOLEAN,
    cn: "高位资金净流出",
    map: "HIGH_FUNDS_OUTFLOW"
  }
};

// 均线指标
export const maIndicatorMapping = {
  breakupMa5days: {
    type: IndicatorType.BOOLEAN,
    cn: "向上突破均线5日",
    map: "BREAKUP_MA_5DAYS"
  },
  breakupMa10days: {
    type: IndicatorType.BOOLEAN,
    cn: "向上突破均线10日",
    map: "BREAKUP_MA_10DAYS"
  },
  breakupMa20days: {
    type: IndicatorType.BOOLEAN,
    cn: "向上突破均线20日",
    map: "BREAKUP_MA_20DAYS"
  },
  breakupMa30days: {
    type: IndicatorType.BOOLEAN,
    cn: "向上突破均线30日",
    map: "BREAKUP_MA_30DAYS"
  },
  breakupMa60days: {
    type: IndicatorType.BOOLEAN,
    cn: "向上突破均线60日",
    map: "BREAKUP_MA_60DAYS"
  },
  longAvgArray: {
    type: IndicatorType.BOOLEAN,
    cn: "均线多头排列",
    map: "LONG_AVG_ARRAY"
  },
  shortAvgArray: {
    type: IndicatorType.BOOLEAN,
    cn: "均线空头排列",
    map: "SHORT_AVG_ARRAY"
  }
};

// K线形态指标
export const klinePatternIndicatorMapping = {
  upperLargeVolume: {
    type: IndicatorType.BOOLEAN,
    cn: "连涨放量",
    map: "UPPER_LARGE_VOLUME"
  },
  downNarrowVolume: {
    type: IndicatorType.BOOLEAN,
    cn: "下跌无量",
    map: "DOWN_NARROW_VOLUME"
  },
  oneDayangLine: {
    type: IndicatorType.BOOLEAN,
    cn: "一根大阳线",
    map: "ONE_DAYANG_LINE"
  },
  twoDayangLines: {
    type: IndicatorType.BOOLEAN,
    cn: "两根大阳线",
    map: "TWO_DAYANG_LINES"
  },
  riseSun: {
    type: IndicatorType.BOOLEAN,
    cn: "旭日东升",
    map: "RISE_SUN"
  },
  powerFulgun: {
    type: IndicatorType.BOOLEAN,
    cn: "强势多方炮",
    map: "POWER_FULGUN"
  },
  restoreJustice: {
    type: IndicatorType.BOOLEAN,
    cn: "拨云见日",
    map: "RESTORE_JUSTICE"
  },
  down7days: {
    type: IndicatorType.BOOLEAN,
    cn: "七仙女下凡(七连阴)",
    map: "DOWN_7DAYS"
  },
  upper8days: {
    type: IndicatorType.BOOLEAN,
    cn: "八仙过海(八连阳)",
    map: "UPPER_8DAYS"
  },
  upper9days: {
    type: IndicatorType.BOOLEAN,
    cn: "九阳神功(九连阳)",
    map: "UPPER_9DAYS"
  },
  upper4days: {
    type: IndicatorType.BOOLEAN,
    cn: "四串阳",
    map: "UPPER_4DAYS"
  },
  heavenRule: {
    type: IndicatorType.BOOLEAN,
    cn: "天量法则",
    map: "HEAVEN_RULE"
  },
  upsideVolume: {
    type: IndicatorType.BOOLEAN,
    cn: "放量上攻",
    map: "UPSIDE_VOLUME"
  }
};

// 股东机构指标
export const institutionalHoldingIndicatorMapping = {
  allcorpNum: {
    type: IndicatorType.NUMBER,
    cn: "机构持股家数合计",
    map: "ALLCORP_NUM"
  },
  allcorpFundNum: {
    type: IndicatorType.NUMBER,
    cn: "基金持股家数",
    map: "ALLCORP_FUND_NUM"
  },
  allcorpQsNum: {
    type: IndicatorType.NUMBER,
    cn: "券商持股家数",
    map: "ALLCORP_QS_NUM"
  },
  allcorpQfiiNum: {
    type: IndicatorType.NUMBER,
    cn: "QFII持股家数",
    map: "ALLCORP_QFII_NUM"
  },
  allcorpBxNum: {
    type: IndicatorType.NUMBER,
    cn: "保险公司持股家数",
    map: "ALLCORP_BX_NUM"
  },
  allcorpSbNum: {
    type: IndicatorType.NUMBER,
    cn: "社保持股家数",
    map: "ALLCORP_SB_NUM"
  },
  allcorpXtNum: {
    type: IndicatorType.NUMBER,
    cn: "信托公司持股家数",
    map: "ALLCORP_XT_NUM"
  },
  allcorpRatio: {
    type: IndicatorType.NUMBER,
    cn: "机构持股比例合计",
    map: "ALLCORP_RATIO"
  },
  allcorpFundRatio: {
    type: IndicatorType.NUMBER,
    cn: "基金持股比例",
    map: "ALLCORP_FUND_RATIO"
  },
  allcorpQsRatio: {
    type: IndicatorType.NUMBER,
    cn: "券商持股比例",
    map: "ALLCORP_QS_RATIO"
  },
  allcorpQfiiRatio: {
    type: IndicatorType.NUMBER,
    cn: "QFII持股比例",
    map: "ALLCORP_QFII_RATIO"
  },
  allcorpBxRatio: {
    type: IndicatorType.NUMBER,
    cn: "保险公司持股比例",
    map: "ALLCORP_BX_RATIO"
  },
  allcorpSbRatio: {
    type: IndicatorType.NUMBER,
    cn: "社保持股比例",
    map: "ALLCORP_SB_RATIO"
  },
  allcorpXtRatio: {
    type: IndicatorType.NUMBER,
    cn: "信托公司持股比例",
    map: "ALLCORP_XT_RATIO"
  }
};

// 资金流向指标
export const capitalFlowIndicatorMapping = {
  netInflow: {
    type: IndicatorType.NUMBER,
    cn: "当日净流入额",
    map: "NET_INFLOW"
  },
  netinflow3days: {
    type: IndicatorType.NUMBER,
    cn: "3日主力净流入",
    map: "NETINFLOW_3DAYS"
  },
  netinflow5days: {
    type: IndicatorType.NUMBER,
    cn: "5日主力净流入",
    map: "NETINFLOW_5DAYS"
  },
  nowinterstRatio: {
    type: IndicatorType.NUMBER,
    cn: "当日增仓占比",
    map: "NOWINTERST_RATIO"
  },
  nowinterstRatio3d: {
    type: IndicatorType.NUMBER,
    cn: "3日增仓占比",
    map: "NOWINTERST_RATIO_3D"
  },
  nowinterstRatio5d: {
    type: IndicatorType.NUMBER,
    cn: "5日增仓占比",
    map: "NOWINTERST_RATIO_5D"
  },
  ddx: {
    type: IndicatorType.NUMBER,
    cn: "当日DDX",
    map: "DDX"
  },
  ddx3d: {
    type: IndicatorType.NUMBER,
    cn: "3日DDX",
    map: "DDX_3D"
  },
  ddx5d: {
    type: IndicatorType.NUMBER,
    cn: "5日DDX",
    map: "DDX_5D"
  },
  ddxRed10d: {
    type: IndicatorType.NUMBER,
    cn: "10日内DDX飘红天数",
    map: "DDX_RED_10D"
  }
};

// 涨跌幅指标
export const priceChangeIndicatorMapping = {
  changerate3days: {
    type: IndicatorType.NUMBER,
    cn: "3日涨跌幅",
    map: "CHANGERATE_3DAYS"
  },
  changerate5days: {
    type: IndicatorType.NUMBER,
    cn: "5日涨跌幅",
    map: "CHANGERATE_5DAYS"
  },
  changerate10days: {
    type: IndicatorType.NUMBER,
    cn: "10日涨跌幅",
    map: "CHANGERATE_10DAYS"
  },
  changerateTy: {
    type: IndicatorType.NUMBER,
    cn: "今年以来涨跌幅",
    map: "CHANGERATE_TY"
  },
  upnday: {
    type: IndicatorType.NUMBER,
    cn: "连涨天数",
    map: "UPNDAY"
  },
  downnday: {
    type: IndicatorType.NUMBER,
    cn: "连跌天数",
    map: "DOWNNDAY"
  }
};

// 港股通指标
export const hkConnectIndicatorMapping = {
  mutualNetbuyAmt: {
    type: IndicatorType.NUMBER,
    cn: "沪深股通净买入金额",
    map: "MUTUAL_NETBUY_AMT"
  },
  holdRatio: {
    type: IndicatorType.NUMBER,
    cn: "沪深股通持股比例",
    map: "HOLD_RATIO"
  }
};

// 合并所有指标
export const selectionIndicatorMapping = {
  ...basicIndicatorMapping,
  ...tradeIndicatorMapping,
  ...companyIndicatorMapping,
  ...indexComponentMapping,
  ...valuationIndicatorMapping,
  ...perShareIndicatorMapping,
  ...financialIndicatorMapping,
  ...growthIndicatorMapping,
  ...balanceSheetIndicatorMapping,
  ...shareStructureIndicatorMapping,
  ...technicalIndicatorMapping,
  ...maIndicatorMapping,
  ...klinePatternIndicatorMapping,
  ...institutionalHoldingIndicatorMapping,
  ...capitalFlowIndicatorMapping,
  ...priceChangeIndicatorMapping,
  ...hkConnectIndicatorMapping
};
