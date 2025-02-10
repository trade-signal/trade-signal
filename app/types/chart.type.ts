export interface ChartTrends {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  preClose: number;
}

export interface ChartKline {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  newPrice: number;
}

export interface SymbolChartData {
  code: string;
  name: string;
  latest: ChartTrends;
  trends: ChartKline[];
}
