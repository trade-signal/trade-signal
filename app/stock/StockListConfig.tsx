import { Text } from "@mantine/core";
import { Column } from "./StockTable";

interface TabConfig {
  value: string;
  label: string;
  columns: Column[];
}

const formatNumber = (value: number, decimals = 2) => value.toFixed(decimals);
const formatBillion = (value: number) => (value / 100000000).toFixed(2);
const renderSignal = (value: boolean) => {
  if (value) {
    return (
      <Text span c="green.7" fw={700}>
        ✓
      </Text>
    );
  }
  return (
    <Text span c="red.7" fw={700}>
      ✗
    </Text>
  );
};

// 表格配置
export const TAB_CONFIGS: TabConfig[] = [
  {
    value: "overview",
    label: "概览",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      { key: "industry", title: "所属行业", width: 120, sortable: true },
      {
        key: "newPrice",
        title: "最新价",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "changeRate",
        title: "涨跌幅(%)",
        width: 100,
        render: formatNumber,
        sortable: true
      },
      {
        key: "totalMarketCap",
        title: "总市值(亿)",
        width: 110,
        render: formatBillion,
        sortable: true
      },
      {
        key: "turnoverRate",
        title: "换手率(%)",
        width: 100,
        render: formatNumber,
        sortable: true
      },
      {
        key: "pe9",
        title: "市盈率",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "roeWeight",
        title: "ROE(%)",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "netprofitYoyRatio",
        title: "净利润增长(%)",
        width: 120,
        render: formatNumber,
        sortable: true
      }
    ]
  },
  {
    value: "price",
    label: "行情交易",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      {
        key: "newPrice",
        title: "最新价",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "changeRate",
        title: "涨跌幅(%)",
        width: 100,
        render: formatNumber,
        sortable: true
      },
      {
        key: "amplitude",
        title: "振幅(%)",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "turnoverRate",
        title: "换手率(%)",
        width: 100,
        render: formatNumber,
        sortable: true
      },
      {
        key: "volumeRatio",
        title: "量比",
        width: 80,
        render: formatNumber,
        sortable: true
      },
      {
        key: "dealAmount",
        title: "成交额",
        width: 120,
        render: formatNumber,
        sortable: true
      },
      {
        key: "changerate5days",
        title: "5日涨跌(%)",
        width: 110,
        render: formatNumber,
        sortable: true
      },
      {
        key: "changerate10days",
        title: "10日涨跌(%)",
        width: 110,
        render: formatNumber,
        sortable: true
      }
    ]
  },
  {
    value: "fundamental",
    label: "基本面",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      {
        key: "roeWeight",
        title: "ROE(%)",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "netprofitYoyRatio",
        title: "净利润增长(%)",
        width: 120,
        render: formatNumber,
        sortable: true
      },
      {
        key: "toiYoyRatio",
        title: "营收增长(%)",
        width: 110,
        render: formatNumber,
        sortable: true
      },
      {
        key: "saleGpr",
        title: "毛利率(%)",
        width: 100,
        render: formatNumber,
        sortable: true
      },
      {
        key: "saleNpr",
        title: "净利率(%)",
        width: 100,
        render: formatNumber,
        sortable: true
      },
      {
        key: "debtAssetRatio",
        title: "资产负债率(%)",
        width: 120,
        render: formatNumber,
        sortable: true
      },
      {
        key: "currentRatio",
        title: "流动比率",
        width: 100,
        render: formatNumber,
        sortable: true
      }
    ]
  },
  {
    value: "valuation",
    label: "估值指标",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      {
        key: "pe9",
        title: "市盈率TTM",
        width: 110,
        render: formatNumber,
        sortable: true
      },
      {
        key: "pettmdeducted",
        title: "市盈率(扣非)",
        width: 120,
        render: formatNumber,
        sortable: true
      },
      {
        key: "pbnewmrq",
        title: "市净率",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "ps9",
        title: "市销率",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "pcfjyxjl9",
        title: "市现率",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "zxgxl",
        title: "股息率(%)",
        width: 100,
        render: formatNumber,
        sortable: true
      },
      {
        key: "totalMarketCap",
        title: "总市值(亿)",
        width: 110,
        render: formatBillion,
        sortable: true
      }
    ]
  },
  {
    value: "growth",
    label: "成长能力",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      {
        key: "netprofitYoyRatio",
        title: "净利润同比(%)",
        width: 120,
        render: formatNumber,
        sortable: true
      },
      {
        key: "netprofitGrowthrate3y",
        title: "净利润3年复合(%)",
        width: 140,
        render: formatNumber,
        sortable: true
      },
      {
        key: "toiYoyRatio",
        title: "营收同比(%)",
        width: 110,
        render: formatNumber,
        sortable: true
      },
      {
        key: "incomeGrowthrate3y",
        title: "营收3年复合(%)",
        width: 130,
        render: formatNumber,
        sortable: true
      },
      {
        key: "basicepsYoyRatio",
        title: "EPS增长率(%)",
        width: 120,
        render: formatNumber,
        sortable: true
      },
      {
        key: "predictNetprofitRatio",
        title: "预测净利增长(%)",
        width: 130,
        render: formatNumber,
        sortable: true
      }
    ]
  },
  {
    value: "profitability",
    label: "盈利质量",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      {
        key: "roeWeight",
        title: "ROE(%)",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "jroa",
        title: "ROA(%)",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "roic",
        title: "ROIC(%)",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "perNetcashOperate",
        title: "每股经营现金流",
        width: 130,
        render: formatNumber,
        sortable: true
      },
      {
        key: "perFcfe",
        title: "每股自由现金流",
        width: 130,
        render: formatNumber,
        sortable: true
      },
      {
        key: "basicEps",
        title: "每股收益",
        width: 100,
        render: formatNumber,
        sortable: true
      }
    ]
  },
  {
    value: "institution",
    label: "机构持股",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      {
        key: "allcorpRatio",
        title: "机构持股比例(%)",
        width: 130,
        render: formatNumber,
        sortable: true
      },
      {
        key: "allcorpFundRatio",
        title: "基金持股比例(%)",
        width: 130,
        render: formatNumber,
        sortable: true
      },
      {
        key: "allcorpSbRatio",
        title: "社保持股比例(%)",
        width: 130,
        render: formatNumber,
        sortable: true
      },
      {
        key: "allcorpQfiiRatio",
        title: "QFII持股比例(%)",
        width: 130,
        render: formatNumber,
        sortable: true
      },
      {
        key: "holdRatioCount",
        title: "十大股东比例(%)",
        width: 130,
        render: formatNumber,
        sortable: true
      },
      {
        key: "holderRatio",
        title: "户数增长率(%)",
        width: 120,
        render: formatNumber,
        sortable: true
      }
    ]
  },
  {
    value: "funds",
    label: "资金动向",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      {
        key: "netInflow",
        title: "当日净流入(万)",
        width: 130,
        render: value => formatNumber(value / 10000),
        sortable: true
      },
      {
        key: "netinflow5days",
        title: "5日净流入(万)",
        width: 130,
        render: value => formatNumber(value / 10000),
        sortable: true
      },
      {
        key: "ddx",
        title: "DDX",
        width: 80,
        render: formatNumber,
        sortable: true
      },
      {
        key: "ddx5d",
        title: "5日DDX",
        width: 90,
        render: formatNumber,
        sortable: true
      },
      {
        key: "nowinterstRatio",
        title: "当日增仓比(%)",
        width: 120,
        render: formatNumber,
        sortable: true
      },
      {
        key: "nowinterstRatio5d",
        title: "5日增仓比(%)",
        width: 120,
        render: formatNumber,
        sortable: true
      }
    ]
  },
  {
    value: "technical",
    label: "技术指标",
    columns: [
      { key: "code", title: "股票代码", width: 100, sortable: true },
      { key: "name", title: "股票名称", width: 120, sortable: true },
      {
        key: "macdGoldenFork",
        title: "MACD金叉",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "kdjGoldenFork",
        title: "KDJ金叉",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "breakupMa5days",
        title: "破5日线",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "breakupMa20days",
        title: "破20日线",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "longAvgArray",
        title: "均线多头",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "breakThrough",
        title: "放量突破",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "upperLargeVolume",
        title: "连涨放量",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "downNarrowVolume",
        title: "下跌无量",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "oneDayangLine",
        title: "大阳线",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "twoDayangLines",
        title: "两阳线",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "lowFundsInflow",
        title: "低位吸筹",
        width: 90,
        render: renderSignal,
        sortable: true
      },
      {
        key: "highFundsOutflow",
        title: "高位出货",
        width: 90,
        render: renderSignal,
        sortable: true
      }
    ]
  }
];
