export type IndicatorType = "date" | "string" | "number" | "boolean" | "array";

export type IndicatorMapping = Record<
  string,
  { type: IndicatorType; value: string; label: string }
>;

// 基本信息指标
export const basicIndicatorMapping: IndicatorMapping = {
  date: {
    type: "date",
    value: "MAX_TRADE_DATE",
    label: "交易日期"
  },
  code: {
    type: "string",
    value: "SECURITY_CODE",
    label: "股票代码"
  },
  name: {
    type: "string",
    value: "SECURITY_NAME_ABBR",
    label: "股票名称"
  },
  secucode: {
    type: "string",
    value: "SECUCODE",
    label: "全代码"
  }
};

// 交易数据指标
export const tradeIndicatorMapping: IndicatorMapping = {
  newPrice: {
    type: "number",
    value: "NEW_PRICE",
    label: "最新价"
  },
  changeRate: {
    type: "number",
    value: "CHANGE_RATE",
    label: "涨跌幅"
  },
  volumeRatio: {
    type: "number",
    value: "VOLUME_RATIO",
    label: "量比"
  },
  highPrice: {
    type: "number",
    value: "HIGH_PRICE",
    label: "最高价"
  },
  lowPrice: {
    type: "number",
    value: "LOW_PRICE",
    label: "最低价"
  },
  preClosePrice: {
    type: "number",
    value: "PRE_CLOSE_PRICE",
    label: "昨收价"
  },
  volume: {
    type: "number",
    value: "VOLUME",
    label: "成交量"
  },
  dealAmount: {
    type: "number",
    value: "DEAL_AMOUNT",
    label: "成交额"
  },
  turnoverRate: {
    type: "number",
    value: "TURNOVERRATE",
    label: "换手率"
  },
  amplitude: {
    type: "number",
    value: "AMPLITUDE",
    label: "振幅"
  }
};

// 公司信息指标
export const companyIndicatorMapping: IndicatorMapping = {
  listingDate: {
    type: "date",
    value: "LISTING_DATE",
    label: "上市日期"
  },
  industry: {
    type: "string",
    value: "INDUSTRY",
    label: "行业"
  },
  area: {
    type: "string",
    value: "AREA",
    label: "地区"
  },
  concept: {
    type: "array",
    value: "CONCEPT",
    label: "概念"
  },
  style: {
    type: "array",
    value: "STYLE",
    label: "风格"
  }
};

// 指数成分指标
export const indexComponentMapping: IndicatorMapping = {
  isHs300: {
    type: "boolean",
    value: "IS_HS300",
    label: "沪深300"
  },
  isSz50: {
    type: "boolean",
    value: "IS_SZ50",
    label: "上证50"
  },
  isZz500: {
    type: "boolean",
    value: "IS_ZZ500",
    label: "中证500"
  },
  isZz1000: {
    type: "boolean",
    value: "IS_ZZ1000",
    label: "中证1000"
  },
  isCy50: {
    type: "boolean",
    value: "IS_CY50",
    label: "创业板50"
  }
};

// 估值指标
export const valuationIndicatorMapping: IndicatorMapping = {
  pe9: {
    type: "number",
    value: "PE9",
    label: "市盈率TTM"
  },
  pbnewmrq: {
    type: "number",
    value: "PBNEWMRQ",
    label: "市净率MRQ"
  },
  pettmdeducted: {
    type: "number",
    value: "PETTMDEDUCTED",
    label: "市盈率TTM扣非"
  },
  ps9: {
    type: "number",
    value: "PS9",
    label: "市销率TTM"
  },
  pcfjyxjl9: {
    type: "number",
    value: "PCFJYXJL9",
    label: "市现率TTM"
  },
  predictPeSyear: {
    type: "number",
    value: "PREDICT_PE_SYEAR",
    label: "预测市盈率今年"
  },
  predictPeNyear: {
    type: "number",
    value: "PREDICT_PE_NYEAR",
    label: "预测市盈率明年"
  },
  totalMarketCap: {
    type: "number",
    value: "TOTAL_MARKET_CAP",
    label: "总市值"
  },
  freeCap: {
    type: "number",
    value: "FREE_CAP",
    label: "流通市值"
  },
  dtsyl: {
    type: "number",
    value: "DTSYL",
    label: "动态市盈率"
  },
  ycpeg: {
    type: "number",
    value: "YCPEG",
    label: "预测PEG"
  },
  enterpriseValueMultiple: {
    type: "number",
    value: "ENTERPRISE_VALUE_MULTIPLE",
    label: "企业价值倍数"
  }
};

// 每股指标
export const perShareIndicatorMapping: IndicatorMapping = {
  basicEps: {
    type: "number",
    value: "BASIC_EPS",
    label: "每股收益"
  },
  bvps: {
    type: "number",
    value: "BVPS",
    label: "每股净资产"
  },
  perNetcashOperate: {
    type: "number",
    value: "PER_NETCASH_OPERATE",
    label: "每股经营现金流"
  },
  perFcfe: {
    type: "number",
    value: "PER_FCFE",
    label: "每股自由现金流"
  },
  perCapitalReserve: {
    type: "number",
    value: "PER_CAPITAL_RESERVE",
    label: "每股资本公积"
  },
  perUnassignProfit: {
    type: "number",
    value: "PER_UNASSIGN_PROFIT",
    label: "每股未分配利润"
  },
  perSurplusReserve: {
    type: "number",
    value: "PER_SURPLUS_RESERVE",
    label: "每股盈余公积"
  },
  perRetainedEarning: {
    type: "number",
    value: "PER_RETAINED_EARNING",
    label: "每股留存收益"
  }
};

// 财务指标
export const financialIndicatorMapping: IndicatorMapping = {
  parentNetprofit: {
    type: "number",
    value: "PARENT_NETPROFIT",
    label: "归属净利润"
  },
  deductNetprofit: {
    type: "number",
    value: "DEDUCT_NETPROFIT",
    label: "扣非净利润"
  },
  totalOperateIncome: {
    type: "number",
    value: "TOTAL_OPERATE_INCOME",
    label: "营业总收入"
  },
  roeWeight: {
    type: "number",
    value: "ROE_WEIGHT",
    label: "净资产收益率ROE"
  },
  jroa: {
    type: "number",
    value: "JROA",
    label: "总资产净利率ROA"
  },
  roic: {
    type: "number",
    value: "ROIC",
    label: "投入资本回报率ROIC"
  },
  zxgxl: {
    type: "number",
    value: "ZXGXL",
    label: "最新股息率"
  },
  saleGpr: {
    type: "number",
    value: "SALE_GPR",
    label: "毛利率"
  },
  saleNpr: {
    type: "number",
    value: "SALE_NPR",
    label: "净利率"
  }
};

// 增长指标
export const growthIndicatorMapping: IndicatorMapping = {
  netprofitYoyRatio: {
    type: "number",
    value: "NETPROFIT_YOY_RATIO",
    label: "净利润增长率"
  },
  deductNetprofitGrowthrate: {
    type: "number",
    value: "DEDUCT_NETPROFIT_GROWTHRATE",
    label: "扣非净利润增长率"
  },
  toiYoyRatio: {
    type: "number",
    value: "TOI_YOY_RATIO",
    label: "营收增长率"
  },
  netprofitGrowthrate3y: {
    type: "number",
    value: "NETPROFIT_GROWTHRATE_3Y",
    label: "净利润3年复合增长率"
  },
  incomeGrowthrate3y: {
    type: "number",
    value: "INCOME_GROWTHRATE_3Y",
    label: "营收3年复合增长率"
  },
  predictNetprofitRatio: {
    type: "number",
    value: "PREDICT_NETPROFIT_RATIO",
    label: "预测净利润同比增长"
  },
  predictIncomeRatio: {
    type: "number",
    value: "PREDICT_INCOME_RATIO",
    label: "预测营收同比增长"
  },
  basicepsYoyRatio: {
    type: "number",
    value: "BASICEPS_YOY_RATIO",
    label: "每股收益同比增长率"
  },
  totalProfitGrowthrate: {
    type: "number",
    value: "TOTAL_PROFIT_GROWTHRATE",
    label: "利润总额同比增长率"
  },
  operateProfitGrowthrate: {
    type: "number",
    value: "OPERATE_PROFIT_GROWTHRATE",
    label: "营业利润同比增长率"
  }
};

// 资产负债指标
export const balanceSheetIndicatorMapping: IndicatorMapping = {
  debtAssetRatio: {
    type: "number",
    value: "DEBT_ASSET_RATIO",
    label: "资产负债率"
  },
  equityRatio: {
    type: "number",
    value: "EQUITY_RATIO",
    label: "产权比率"
  },
  equityMultiplier: {
    type: "number",
    value: "EQUITY_MULTIPLIER",
    label: "权益乘数"
  },
  currentRatio: {
    type: "number",
    value: "CURRENT_RATIO",
    label: "流动比率"
  },
  speedRatio: {
    type: "number",
    value: "SPEED_RATIO",
    label: "速动比率"
  }
};

// 股本结构指标
export const shareStructureIndicatorMapping: IndicatorMapping = {
  totalShares: {
    type: "number",
    value: "TOTAL_SHARES",
    label: "总股本"
  },
  freeShares: {
    type: "number",
    value: "FREE_SHARES",
    label: "流通股本"
  },
  holderNewest: {
    type: "number",
    value: "HOLDER_NEWEST",
    label: "最新股东户数"
  },
  holderRatio: {
    type: "number",
    value: "HOLDER_RATIO",
    label: "股东户数增长率"
  },
  holdAmount: {
    type: "number",
    value: "HOLD_AMOUNT",
    label: "户均持股金额"
  },
  avgHoldNum: {
    type: "number",
    value: "AVG_HOLD_NUM",
    label: "户均持股数量"
  },
  holdnumGrowthrate3q: {
    type: "number",
    value: "HOLDNUM_GROWTHRATE_3Q",
    label: "户均持股数季度增长率"
  },
  holdnumGrowthrateHy: {
    type: "number",
    value: "HOLDNUM_GROWTHRATE_HY",
    label: "户均持股数半年增长率"
  },
  holdRatioCount: {
    type: "number",
    value: "HOLD_RATIO_COUNT",
    label: "十大股东持股比例合计"
  },
  freeHoldRatio: {
    type: "number",
    value: "FREE_HOLD_RATIO",
    label: "十大流通股东比例合计"
  }
};

// 技术指标
export const technicalIndicatorMapping: IndicatorMapping = {
  macdGoldenFork: {
    type: "boolean",
    value: "MACD_GOLDEN_FORK",
    label: "MACD金叉日线"
  },
  macdGoldenForkz: {
    type: "boolean",
    value: "MACD_GOLDEN_FORKZ",
    label: "MACD金叉周线"
  },
  macdGoldenForky: {
    type: "boolean",
    value: "MACD_GOLDEN_FORKY",
    label: "MACD金叉月线"
  },
  kdjGoldenFork: {
    type: "boolean",
    value: "KDJ_GOLDEN_FORK",
    label: "KDJ金叉日线"
  },
  kdjGoldenForkz: {
    type: "boolean",
    value: "KDJ_GOLDEN_FORKZ",
    label: "KDJ金叉周线"
  },
  kdjGoldenForky: {
    type: "boolean",
    value: "KDJ_GOLDEN_FORKY",
    label: "KDJ金叉月线"
  },
  breakThrough: {
    type: "boolean",
    value: "BREAK_THROUGH",
    label: "放量突破"
  },
  lowFundsInflow: {
    type: "boolean",
    value: "LOW_FUNDS_INFLOW",
    label: "低位资金净流入"
  },
  highFundsOutflow: {
    type: "boolean",
    value: "HIGH_FUNDS_OUTFLOW",
    label: "高位资金净流出"
  }
};

// 均线指标
export const maIndicatorMapping: IndicatorMapping = {
  breakupMa5days: {
    type: "boolean",
    value: "BREAKUP_MA_5DAYS",
    label: "向上突破均线5日"
  },
  breakupMa10days: {
    type: "boolean",
    value: "BREAKUP_MA_10DAYS",
    label: "向上突破均线10日"
  },
  breakupMa20days: {
    type: "boolean",
    value: "BREAKUP_MA_20DAYS",
    label: "向上突破均线20日"
  },
  breakupMa30days: {
    type: "boolean",
    value: "BREAKUP_MA_30DAYS",
    label: "向上突破均线30日"
  },
  breakupMa60days: {
    type: "boolean",
    value: "BREAKUP_MA_60DAYS",
    label: "向上突破均线60日"
  },
  longAvgArray: {
    type: "boolean",
    value: "LONG_AVG_ARRAY",
    label: "均线多头排列"
  },
  shortAvgArray: {
    type: "boolean",
    value: "SHORT_AVG_ARRAY",
    label: "均线空头排列"
  }
};

// K线形态指标
export const klinePatternIndicatorMapping: IndicatorMapping = {
  upperLargeVolume: {
    type: "boolean",
    value: "UPPER_LARGE_VOLUME",
    label: "连涨放量"
  },
  downNarrowVolume: {
    type: "boolean",
    value: "DOWN_NARROW_VOLUME",
    label: "下跌无量"
  },
  oneDayangLine: {
    type: "boolean",
    value: "ONE_DAYANG_LINE",
    label: "一根大阳线"
  },
  twoDayangLines: {
    type: "boolean",
    value: "TWO_DAYANG_LINES",
    label: "两根大阳线"
  },
  riseSun: {
    type: "boolean",
    value: "RISE_SUN",
    label: "旭日东升"
  },
  powerFulgun: {
    type: "boolean",
    value: "POWER_FULGUN",
    label: "强势多方炮"
  },
  restoreJustice: {
    type: "boolean",
    value: "RESTORE_JUSTICE",
    label: "拨云见日"
  },
  down7days: {
    type: "boolean",
    value: "DOWN_7DAYS",
    label: "七仙女下凡(七连阴)"
  },
  upper8days: {
    type: "boolean",
    value: "UPPER_8DAYS",
    label: "八仙过海(八连阳)"
  },
  upper9days: {
    type: "boolean",
    value: "UPPER_9DAYS",
    label: "九阳神功(九连阳)"
  },
  upper4days: {
    type: "boolean",
    value: "UPPER_4DAYS",
    label: "四串阳"
  },
  heavenRule: {
    type: "boolean",
    value: "HEAVEN_RULE",
    label: "天��法则"
  },
  upsideVolume: {
    type: "boolean",
    value: "UPSIDE_VOLUME",
    label: "放量上攻"
  }
};

// 股东机构指标
export const institutionalHoldingIndicatorMapping: IndicatorMapping = {
  allcorpNum: {
    type: "number",
    value: "ALLCORP_NUM",
    label: "机构持股家数合计"
  },
  allcorpFundNum: {
    type: "number",
    value: "ALLCORP_FUND_NUM",
    label: "基金持股家数"
  },
  allcorpQsNum: {
    type: "number",
    value: "ALLCORP_QS_NUM",
    label: "券商持股家数"
  },
  allcorpQfiiNum: {
    type: "number",
    value: "ALLCORP_QFII_NUM",
    label: "QFII持股家数"
  },
  allcorpBxNum: {
    type: "number",
    value: "ALLCORP_BX_NUM",
    label: "保险公司持股家数"
  },
  allcorpSbNum: {
    type: "number",
    value: "ALLCORP_SB_NUM",
    label: "社保持股家数"
  },
  allcorpXtNum: {
    type: "number",
    value: "ALLCORP_XT_NUM",
    label: "信托公司持股家数"
  },
  allcorpRatio: {
    type: "number",
    value: "ALLCORP_RATIO",
    label: "机构持股比例合计"
  },
  allcorpFundRatio: {
    type: "number",
    value: "ALLCORP_FUND_RATIO",
    label: "基金持股比例"
  },
  allcorpQsRatio: {
    type: "number",
    value: "ALLCORP_QS_RATIO",
    label: "券商持股比例"
  },
  allcorpQfiiRatio: {
    type: "number",
    value: "ALLCORP_QFII_RATIO",
    label: "QFII持股比例"
  },
  allcorpBxRatio: {
    type: "number",
    value: "ALLCORP_BX_RATIO",
    label: "保险公司持股比例"
  },
  allcorpSbRatio: {
    type: "number",
    value: "ALLCORP_SB_RATIO",
    label: "社保持股比例"
  },
  allcorpXtRatio: {
    type: "number",
    value: "ALLCORP_XT_RATIO",
    label: "信托公司持股比例"
  }
};

// 资金流向指标
export const capitalFlowIndicatorMapping: IndicatorMapping = {
  netInflow: {
    type: "number",
    value: "NET_INFLOW",
    label: "当日净流入额"
  },
  netinflow3days: {
    type: "number",
    value: "NETINFLOW_3DAYS",
    label: "3日主力净流入"
  },
  netinflow5days: {
    type: "number",
    value: "NETINFLOW_5DAYS",
    label: "5日主力净流入"
  },
  nowinterstRatio: {
    type: "number",
    value: "NOWINTERST_RATIO",
    label: "当日增仓占比"
  },
  nowinterstRatio3d: {
    type: "number",
    value: "NOWINTERST_RATIO_3D",
    label: "3日增仓占比"
  },
  nowinterstRatio5d: {
    type: "number",
    value: "NOWINTERST_RATIO_5D",
    label: "5日增仓占比"
  },
  ddx: {
    type: "number",
    value: "DDX",
    label: "当日DDX"
  },
  ddx3d: {
    type: "number",
    value: "DDX_3D",
    label: "3日DDX"
  },
  ddx5d: {
    type: "number",
    value: "DDX_5D",
    label: "5日DDX"
  },
  ddxRed10d: {
    type: "number",
    value: "DDX_RED_10D",
    label: "10日内DDX飘红天数"
  }
};

// 涨跌幅指标
export const priceChangeIndicatorMapping: IndicatorMapping = {
  changerate3days: {
    type: "number",
    value: "CHANGERATE_3DAYS",
    label: "3日涨跌幅"
  },
  changerate5days: {
    type: "number",
    value: "CHANGERATE_5DAYS",
    label: "5日涨跌幅"
  },
  changerate10days: {
    type: "number",
    value: "CHANGERATE_10DAYS",
    label: "10日涨跌幅"
  },
  changerateTy: {
    type: "number",
    value: "CHANGERATE_TY",
    label: "今年以来涨跌幅"
  },
  upnday: {
    type: "number",
    value: "UPNDAY",
    label: "连涨天数"
  },
  downnday: {
    type: "number",
    value: "DOWNNDAY",
    label: "连跌天数"
  }
};

// 港股通指标
export const hkConnectIndicatorMapping: IndicatorMapping = {
  mutualNetbuyAmt: {
    type: "number",
    value: "MUTUAL_NETBUY_AMT",
    label: "沪深股通净买入金额"
  },
  holdRatio: {
    type: "number",
    value: "HOLD_RATIO",
    label: "沪深股通持股比例"
  }
};

// 合并所有指标
export const indicatorMapping: IndicatorMapping = {
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
