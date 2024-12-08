// 选股指标映射 20241208
export const selectionMapping = {
  // 基本信息
  date: "MAX_TRADE_DATE",
  code: "SECURITY_CODE",
  name: "SECURITY_NAME_ABBR",
  secucode: "SECUCODE",

  // 交易数据
  newPrice: "NEW_PRICE",
  changeRate: "CHANGE_RATE",
  volumeRatio: "VOLUME_RATIO",
  highPrice: "HIGH_PRICE",
  lowPrice: "LOW_PRICE",
  preClosePrice: "PRE_CLOSE_PRICE",
  volume: "VOLUME",
  dealAmount: "DEAL_AMOUNT",
  turnoverRate: "TURNOVERRATE",
  amplitude: "AMPLITUDE",

  // 公司信息
  listingDate: "LISTING_DATE",
  industry: "INDUSTRY",
  area: "AREA",
  concept: "CONCEPT",
  style: "STYLE",

  // 指数成分
  isHs300: "IS_HS300",
  isSz50: "IS_SZ50",
  isZz500: "IS_ZZ500",
  isZz1000: "IS_ZZ1000",
  isCy50: "IS_CY50",

  // 估值指标
  pe9: "PE9",
  pbnewmrq: "PBNEWMRQ",
  pettmdeducted: "PETTMDEDUCTED",
  ps9: "PS9",
  pcfjyxjl9: "PCFJYXJL9",
  predictPeSyear: "PREDICT_PE_SYEAR",
  predictPeNyear: "PREDICT_PE_NYEAR",
  totalMarketCap: "TOTAL_MARKET_CAP",
  freeCap: "FREE_CAP",
  dtsyl: "DTSYL",
  ycpeg: "YCPEG",
  enterpriseValueMultiple: "ENTERPRISE_VALUE_MULTIPLE",

  // 每股指标
  basicEps: "BASIC_EPS",
  bvps: "BVPS",
  perNetcashOperate: "PER_NETCASH_OPERATE",
  perFcfe: "PER_FCFE",
  perCapitalReserve: "PER_CAPITAL_RESERVE",
  perUnassignProfit: "PER_UNASSIGN_PROFIT",
  perSurplusReserve: "PER_SURPLUS_RESERVE",
  perRetainedEarning: "PER_RETAINED_EARNING",

  // 财务指标
  parentNetprofit: "PARENT_NETPROFIT",
  deductNetprofit: "DEDUCT_NETPROFIT",
  totalOperateIncome: "TOTAL_OPERATE_INCOME",
  roeWeight: "ROE_WEIGHT",
  jroa: "JROA",
  roic: "ROIC",
  zxgxl: "ZXGXL",
  saleGpr: "SALE_GPR",
  saleNpr: "SALE_NPR",

  // 增长指标
  netprofitYoyRatio: "NETPROFIT_YOY_RATIO",
  deductNetprofitGrowthrate: "DEDUCT_NETPROFIT_GROWTHRATE",
  toiYoyRatio: "TOI_YOY_RATIO",
  netprofitGrowthrate3y: "NETPROFIT_GROWTHRATE_3Y",
  incomeGrowthrate3y: "INCOME_GROWTHRATE_3Y",
  predictNetprofitRatio: "PREDICT_NETPROFIT_RATIO",
  predictIncomeRatio: "PREDICT_INCOME_RATIO",
  basicepsYoyRatio: "BASICEPS_YOY_RATIO",
  totalProfitGrowthrate: "TOTAL_PROFIT_GROWTHRATE",
  operateProfitGrowthrate: "OPERATE_PROFIT_GROWTHRATE",

  // 资产负债指标
  debtAssetRatio: "DEBT_ASSET_RATIO",
  equityRatio: "EQUITY_RATIO",
  equityMultiplier: "EQUITY_MULTIPLIER",
  currentRatio: "CURRENT_RATIO",
  speedRatio: "SPEED_RATIO",

  // 股本结构
  totalShares: "TOTAL_SHARES",
  freeShares: "FREE_SHARES",
  holderNewest: "HOLDER_NEWEST",
  holderRatio: "HOLDER_RATIO",
  holdAmount: "HOLD_AMOUNT",
  avgHoldNum: "AVG_HOLD_NUM",
  holdnumGrowthrate3q: "HOLDNUM_GROWTHRATE_3Q",
  holdnumGrowthrateHy: "HOLDNUM_GROWTHRATE_HY",
  holdRatioCount: "HOLD_RATIO_COUNT",
  freeHoldRatio: "FREE_HOLD_RATIO",

  // 技术指标
  macdGoldenFork: "MACD_GOLDEN_FORK",
  macdGoldenForkz: "MACD_GOLDEN_FORKZ",
  macdGoldenForky: "MACD_GOLDEN_FORKY",
  kdjGoldenFork: "KDJ_GOLDEN_FORK",
  kdjGoldenForkz: "KDJ_GOLDEN_FORKZ",
  kdjGoldenForky: "KDJ_GOLDEN_FORKY",
  breakThrough: "BREAK_THROUGH",
  lowFundsInflow: "LOW_FUNDS_INFLOW",
  highFundsOutflow: "HIGH_FUNDS_OUTFLOW",

  // 均线突破
  breakupMa5days: "BREAKUP_MA_5DAYS",
  breakupMa10days: "BREAKUP_MA_10DAYS",
  breakupMa20days: "BREAKUP_MA_20DAYS",
  breakupMa30days: "BREAKUP_MA_30DAYS",
  breakupMa60days: "BREAKUP_MA_60DAYS",
  longAvgArray: "LONG_AVG_ARRAY",
  shortAvgArray: "SHORT_AVG_ARRAY",

  // K线形态
  upperLargeVolume: "UPPER_LARGE_VOLUME",
  downNarrowVolume: "DOWN_NARROW_VOLUME",
  oneDayangLine: "ONE_DAYANG_LINE",
  twoDayangLines: "TWO_DAYANG_LINES",
  riseSun: "RISE_SUN",
  powerFulgun: "POWER_FULGUN",
  restoreJustice: "RESTORE_JUSTICE",
  down7days: "DOWN_7DAYS",
  upper8days: "UPPER_8DAYS",
  upper9days: "UPPER_9DAYS",
  upper4days: "UPPER_4DAYS",
  heavenRule: "HEAVEN_RULE",
  upsideVolume: "UPSIDE_VOLUME",

  // 股东机构
  allcorpNum: "ALLCORP_NUM",
  allcorpFundNum: "ALLCORP_FUND_NUM",
  allcorpQsNum: "ALLCORP_QS_NUM",
  allcorpQfiiNum: "ALLCORP_QFII_NUM",
  allcorpBxNum: "ALLCORP_BX_NUM",
  allcorpSbNum: "ALLCORP_SB_NUM",
  allcorpXtNum: "ALLCORP_XT_NUM",
  allcorpRatio: "ALLCORP_RATIO",
  allcorpFundRatio: "ALLCORP_FUND_RATIO",
  allcorpQsRatio: "ALLCORP_QS_RATIO",
  allcorpQfiiRatio: "ALLCORP_QFII_RATIO",
  allcorpBxRatio: "ALLCORP_BX_RATIO",
  allcorpSbRatio: "ALLCORP_SB_RATIO",
  allcorpXtRatio: "ALLCORP_XT_RATIO",

  // 资金流向
  netInflow: "NET_INFLOW",
  netinflow3days: "NETINFLOW_3DAYS",
  netinflow5days: "NETINFLOW_5DAYS",
  nowinterstRatio: "NOWINTERST_RATIO",
  nowinterstRatio3d: "NOWINTERST_RATIO_3D",
  nowinterstRatio5d: "NOWINTERST_RATIO_5D",
  ddx: "DDX",
  ddx3d: "DDX_3D",
  ddx5d: "DDX_5D",
  ddxRed10d: "DDX_RED_10D",

  // 涨跌幅数据
  changerate3days: "CHANGERATE_3DAYS",
  changerate5days: "CHANGERATE_5DAYS",
  changerate10days: "CHANGERATE_10DAYS",
  changerateTy: "CHANGERATE_TY",
  upnday: "UPNDAY",
  downnday: "DOWNNDAY",

  // 港股通数据
  mutualNetbuyAmt: "MUTUAL_NETBUY_AMT",
  holdRatio: "HOLD_RATIO"
};
