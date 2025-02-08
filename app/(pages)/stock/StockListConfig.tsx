import { StockScreener } from "@prisma/client";
import { Column } from "@/app/components/tables/DataTable/types";

import {
  formatBillion,
  formatNumber,
  formatPercent,
  formatYuan,
  renderSignal
} from "@/app/components/tables/DataTable/util";

interface TabConfig {
  value: string;
  label: string;
  columns: Column<StockScreener>[];
}

// 公共列
const COMMON_COLUMNS = [
  {
    key: "code",
    title: "股票代码",
    width: 100,
    align: "left",
    searchable: true,
    sortable: true
  },
  {
    key: "name",
    title: "股票名称",
    width: 120,
    sortable: true,
    align: "left"
  }
] as const;

// 表格配置
export const TAB_CONFIGS: TabConfig[] = [
  {
    value: "overview",
    label: "概览",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "industry",
        title: "所属行业",
        align: "left",
        width: 120,
        sortable: true
      },
      {
        key: "newPrice",
        title: "最新价",
        width: 90,
        align: "right",
        render: value => formatNumber(value),
        sortable: true
      },
      {
        key: "changeRate",
        title: "涨跌幅(%)",
        width: 100,
        align: "right",
        render: value => formatPercent(value),
        sortable: true
      },
      {
        key: "totalMarketCap",
        title: "总市值(亿)",
        width: 110,
        align: "right",
        render: value => formatBillion(value),
        sortable: true
      },
      {
        key: "turnoverRate",
        title: "换手率(%)",
        width: 100,
        align: "right",
        render: value => formatPercent(value),
        sortable: true
      },
      {
        key: "pe9",
        title: "市盈率TTM",
        width: 90,
        align: "right",
        render: value => formatNumber(value),
        sortable: true
      },
      {
        key: "roeWeight",
        title: "ROE(%)",
        width: 90,
        align: "right",
        render: value => formatPercent(value),
        sortable: true
      },
      {
        key: "netprofitYoyRatio",
        title: "净利润增长(%)",
        width: 120,
        align: "right",
        render: value => formatPercent(value),
        sortable: true
      }
    ]
  },
  {
    value: "price",
    label: "行情交易",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "newPrice",
        title: "最新价",
        width: 90,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "changeRate",
        title: "涨跌幅(%)",
        width: 100,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "amplitude",
        title: "振幅(%)",
        width: 90,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "turnoverRate",
        title: "换手率(%)",
        width: 100,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "volumeRatio",
        title: "量比",
        width: 80,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "dealAmount",
        title: "成交额",
        width: 120,
        render: value => formatYuan(value),
        sortable: true,
        align: "right"
      },
      {
        key: "changerate5days",
        title: "5日涨跌(%)",
        width: 110,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "changerate10days",
        title: "10日涨跌(%)",
        width: 110,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      }
    ]
  },
  {
    value: "fundamental",
    label: "基本面",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "roeWeight",
        title: "ROE(%)",
        width: 90,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "netprofitYoyRatio",
        title: "净利润增长(%)",
        width: 120,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "toiYoyRatio",
        title: "营收增长(%)",
        width: 110,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "saleGpr",
        title: "毛利率(%)",
        width: 100,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "saleNpr",
        title: "净利率(%)",
        width: 100,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "debtAssetRatio",
        title: "资产负债率(%)",
        width: 120,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "currentRatio",
        title: "流动比率",
        width: 100,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      }
    ]
  },
  {
    value: "valuation",
    label: "估值指标",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "pe9",
        title: "市盈率TTM",
        width: 110,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "pettmdeducted",
        title: "市盈率(扣非)",
        width: 120,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "pbnewmrq",
        title: "市净率",
        width: 90,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "ps9",
        title: "市销率",
        width: 90,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "pcfjyxjl9",
        title: "市现率",
        width: 90,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "zxgxl",
        title: "股息率(%)",
        width: 100,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "totalMarketCap",
        title: "总市值(亿)",
        width: 110,
        render: value => formatBillion(value),
        sortable: true,
        align: "right"
      }
    ]
  },
  {
    value: "growth",
    label: "成长能力",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "netprofitYoyRatio",
        title: "净利润同比(%)",
        width: 120,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "netprofitGrowthrate3y",
        title: "净利润3年复合(%)",
        width: 140,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "toiYoyRatio",
        title: "营收同比(%)",
        width: 110,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "incomeGrowthrate3y",
        title: "营收3年复合(%)",
        width: 130,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "basicepsYoyRatio",
        title: "EPS增长率(%)",
        width: 120,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "predictNetprofitRatio",
        title: "预测净利增长(%)",
        width: 130,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      }
    ]
  },
  {
    value: "profitability",
    label: "盈利质量",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "roeWeight",
        title: "ROE(%)",
        width: 90,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "jroa",
        title: "ROA(%)",
        width: 90,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "roic",
        title: "ROIC(%)",
        width: 90,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "perNetcashOperate",
        title: "每股经营现金流",
        width: 130,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "perFcfe",
        title: "每股自由现金流",
        width: 130,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "basicEps",
        title: "每股收益",
        width: 100,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      }
    ]
  },
  {
    value: "institution",
    label: "机构持股",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "allcorpRatio",
        title: "机构持股比例(%)",
        width: 130,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "allcorpFundRatio",
        title: "基金持股比例(%)",
        width: 130,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "allcorpSbRatio",
        title: "社保持股比例(%)",
        width: 130,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "allcorpQfiiRatio",
        title: "QFII持股比例(%)",
        width: 130,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "holdRatioCount",
        title: "十大股东比例(%)",
        width: 130,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "holderRatio",
        title: "户数增长率(%)",
        width: 120,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      }
    ]
  },
  {
    value: "funds",
    label: "资金动向",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "netInflow",
        title: "当日净流入(万)",
        width: 130,
        render: value => formatNumber(value / 10000),
        sortable: true,
        align: "right"
      },
      {
        key: "netinflow5days",
        title: "5日净流入(万)",
        width: 130,
        render: value => formatNumber(value / 10000),
        sortable: true,
        align: "right"
      },
      {
        key: "ddx",
        title: "DDX",
        width: 80,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "ddx5d",
        title: "5日DDX",
        width: 90,
        render: value => formatNumber(value),
        sortable: true,
        align: "right"
      },
      {
        key: "nowinterstRatio",
        title: "当日增仓比(%)",
        width: 120,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      },
      {
        key: "nowinterstRatio5d",
        title: "5日增仓比(%)",
        width: 120,
        render: value => formatPercent(value),
        sortable: true,
        align: "right"
      }
    ]
  },
  {
    value: "technical",
    label: "技术指标",
    columns: [
      ...COMMON_COLUMNS,
      {
        key: "macdGoldenFork",
        title: "MACD金叉",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "kdjGoldenFork",
        title: "KDJ金叉",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "breakupMa5days",
        title: "破5日线",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "breakupMa20days",
        title: "破20日线",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "longAvgArray",
        title: "均线多头",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "breakThrough",
        title: "放量突破",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "upperLargeVolume",
        title: "连涨放量",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "downNarrowVolume",
        title: "下跌无量",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "oneDayangLine",
        title: "大阳线",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "twoDayangLines",
        title: "两阳线",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "lowFundsInflow",
        title: "低位吸筹",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      },
      {
        key: "highFundsOutflow",
        title: "高位出货",
        width: 90,
        render: renderSignal,
        sortable: true,
        align: "right"
      }
    ]
  }
];

// 排序字段
export const getOrderBy = (orderBy?: string, order?: string) => {
  if (!orderBy || !order) return "";

  const columns = new Set(
    TAB_CONFIGS.flatMap(tab => tab.columns.map(column => column))
  );
  const column = Array.from(columns).find(column => column.key === orderBy);
  if (!column) return "";

  return `${column.title} ${order === "asc" ? "升序" : "降序"}`;
};
