import { useEffect, useRef, useState } from "react";
import {
  ChartOptions,
  createChart,
  IChartApi,
  UTCTimestamp,
  ColorType,
  DeepPartial
} from "lightweight-charts";
import dayjs from "dayjs";
import { StockIndexRealTime } from "@prisma/client";

interface StockIndexChartProps {
  code: string;
  name: string;
  latest: StockIndexRealTime;
  trends: StockIndexRealTime[];
}

const StockIndexChart = ({
  code,
  name,
  latest,
  trends
}: StockIndexChartProps) => {
  const [chartType, setChartType] = useState<"line" | "candle">("candle");

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const handleChartTypeChange = (chart: IChartApi, type: "line" | "candle") => {
    setChartType(type);

    switch (type) {
      case "line":
        const baselineSeries = chart.addBaselineSeries({
          baseValue: { type: "price", price: latest.preClosePrice },
          topLineColor: "rgba(236, 64, 64, 1)",
          topFillColor1: "rgba(236, 64, 64, 0.28)",
          topFillColor2: "rgba(236, 64, 64, 0.05)",
          bottomLineColor: "rgba(46, 139, 87, 1)",
          bottomFillColor1: "rgba(46, 139, 87, 0.05)",
          bottomFillColor2: "rgba(46, 139, 87, 0.28)"
        });

        const baselineData = trends.map(item => ({
          time: dayjs(item.date).unix() as UTCTimestamp,
          value: item.newPrice
        }));

        baselineSeries.setData(baselineData);
        break;
      case "candle":
        const candleSeries = chart.addCandlestickSeries();

        console.log(trends);

        const candleData = trends.map(item => ({
          time: dayjs(item.date).unix() as UTCTimestamp,
          open: item.openPrice,
          high: item.highPrice,
          low: item.lowPrice,
          close: item.newPrice
        }));

        candleSeries.setData(candleData);
        break;
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: "black",
        background: { type: "solid" as ColorType, color: "white" },
        attributionLogo: false
      },
      autoSize: true,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          return dayjs.unix(time).format("HH:mm");
        },
        rightOffset: 5,
        barSpacing: 5,
        minBarSpacing: 2
      }
    };
    const chart = createChart(chartContainerRef.current!, chartOptions);

    chart.timeScale().fitContent();

    handleChartTypeChange(chart, chartType);

    return () => {
      chart.remove();
    };
  }, [code, trends]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "300px" }}
    ></div>
  );
};

export default StockIndexChart;
