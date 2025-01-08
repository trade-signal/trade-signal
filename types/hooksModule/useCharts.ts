import type { ColorType } from "lightweight-charts";

interface ILayout {
  textColor: string;
  background: {
    type: ColorType;
    color: string;
  };
}

// TODO
interface SymbolChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  preClose: number;
}

export interface ICustomToolTipConfig {
  // label 名称
  name: string;

  latest: SymbolChartData;

  chartType: "area" | "candle";
}

export interface ICustomChartConfig {
  // 是否自动调整大小
  autoSize: Boolean
  // 图表类型
  chartType: "area" | "candle";

  // 布局
  layout: {
    // 文字颜色
    textColor: string;

    // 背景
    background: {
      type: "solid" | "gradient";
      color: string;
    };

    // 是否显示版权logo
    attributionLogo: boolean;
  };
}
