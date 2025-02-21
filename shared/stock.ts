export type MarketType = "all" | "sh" | "sz" | "bj";

export const getStockCodePrefixes = (marketType: MarketType): string[] => {
  switch (marketType) {
    case "sh":
      return ["60", "688", "689"]; // 上海主板60开头，科创板688/689开头
    case "sz":
      return ["00", "30", "301", "002"]; // 深圳主板00开头，创业板30/300/301开头，中小板002开头
    case "bj":
      return ["83", "87", "82"]; // 北交所83/87/82开头
    default:
      return [];
  }
};
