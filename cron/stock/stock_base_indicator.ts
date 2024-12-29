import { IndicatorMapping } from "../type";

export const stockBaseIndicatorMapping: IndicatorMapping = {
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
  newPrice: {
    type: "number",
    cn: "最新价",
    map: "f2"
  },
  industry: {
    type: "string",
    cn: "所处行业",
    map: "f100"
  },
  listingDate: {
    type: "date",
    cn: "上市日期",
    map: "f26"
  }
};
