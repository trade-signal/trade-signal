import { ChartData } from "@/app/types/chart.type";
import { StockIndexRealTime, StockQuotesRealTime } from "@prisma/client";
import dayjs from "dayjs";

export const transformSymbolChartData = (
  data: StockIndexRealTime | StockQuotesRealTime
): ChartData => {
  return {
    date: dayjs(Number(data.ts)).format("YYYY-MM-DD HH:mm:ss"),
    open: data.openPrice,
    high: data.highPrice,
    low: data.lowPrice,
    close: data.newPrice,
    preClose: data.preClosePrice
  };
};
