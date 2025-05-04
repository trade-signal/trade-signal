export type MarketType = "all" | "sh" | "sz" | "bj" | "cyb" | "kcb" | "bjb";

export const getStockCodePrefixes = (marketType: MarketType): string[] => {
  switch (marketType) {
    case "sh":
      return ["60", "688", "689"]; // 上海主板60开头，科创板688/689开头
    case "sz":
      return ["00", "30", "301", "002"]; // 深圳主板00开头，创业板30/300/301开头，中小板002开头
    case "bj":
      return ["83", "87", "82"]; // 北交所83/87/82开头
    case "cyb":
      return ["300", "301"]; // 创业板300/301开头
    case "kcb":
      return ["688"]; // 科创板688开头
    default:
      return [];
  }
};

export const MARKET_OPTIONS = [
  { label: "沪京深A股", value: "all" },
  { label: "上证A股", value: "sh" },
  { label: "深证A股", value: "sz" },
  { label: "北证A股", value: "bj" },
  { label: "科创板", value: "kcb" },
  { label: "创业板", value: "cyb" }
] as { label: string; value: string }[];

export type TreemapSortType =
  | "totalMarketCap"
  | "freeCap"
  | "changeRate"
  | "turnoverRate"
  | "volume"
  | "dealAmount";

export const TREEMAP_SORT_OPTIONS = [
  {
    label: "总市值",
    value: "totalMarketCap"
  },
  {
    label: "流通市值",
    value: "freeCap"
  },
  {
    label: "涨跌幅",
    value: "changeRate"
  },
  {
    label: "换手率",
    value: "turnoverRate"
  },
  { label: "成交量", value: "volume" },
  { label: "成交额", value: "dealAmount" }
] as { label: string; value: TreemapSortType }[];
