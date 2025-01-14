export interface ChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  preClose: number;
}

export interface SymbolChartData {
  code: string;
  name: string;
  latest: ChartData;
  trends: ChartData[];
}
