import { ChartKline, ChartTrends } from "@/apps/web/app/types/chart.type";
import {
  StockQuotes,
  StockIndexQuotes,
  StockIndexMinuteKline,
  StockMinuteKline
} from "@prisma/client";
import dayjs from "dayjs";

export const transformSymbolChartTrends = (
  data: StockQuotes | StockIndexQuotes
): ChartTrends => {
  return {
    date: dayjs(data.date).format("YYYY-MM-DD HH:mm:ss"),
    open: data.openPrice,
    high: data.highPrice,
    low: data.lowPrice,
    close: data.newPrice,
    preClose: data.preClosePrice
  };
};

export const transformSymbolChartKline = (
  data: StockIndexMinuteKline | StockMinuteKline
): ChartKline => {
  return {
    date: dayjs(`${data.date} ${data.time}`).format("YYYY-MM-DD HH:mm:ss"),
    open: data.openPrice,
    high: data.highPrice,
    low: data.lowPrice,
    close: data.closePrice,
    newPrice: data.newPrice
  };
};
