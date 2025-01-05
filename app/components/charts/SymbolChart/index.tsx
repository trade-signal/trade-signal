import { useEffect, useRef, useState } from "react";
import {
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  ColorType,
  DeepPartial
} from "lightweight-charts";
import dayjs from "dayjs";
import { Group, rem, SegmentedControl, Stack } from "@mantine/core";
import { IconChartCandle } from "@tabler/icons-react";
import { IconChartLine } from "@tabler/icons-react";

interface SymbolChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  preClose: number;
}

interface SymbolChartProps {
  code: string;
  name: string;
  latest: SymbolChartData;
  trends: SymbolChartData[];
}

const SymbolChart = ({ code, name, latest, trends }: SymbolChartProps) => {
  const [chartType, setChartType] = useState<"line" | "candle">("line");

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any, any>[]>([]);

  const createSymbolChart = (chartContainerRef: HTMLDivElement) => {
    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: "black",
        background: { type: "solid" as ColorType, color: "white" },
        attributionLogo: false
      },
      autoSize: true,
      localization: {
        locale: "zh-CN",
        priceFormatter: (price: number) => price && price.toFixed(2),
        timeFormatter: (time: number) => {
          return dayjs.unix(time).format("MM-DD HH:mm");
        }
      },
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
    return createChart(chartContainerRef, chartOptions);
  };

  const clearSeries = (chart: IChartApi) => {
    seriesRef.current.forEach(series => {
      try {
        series && chart.removeSeries(series);
      } catch (error) {
        console.log(error);
      }
    });
    seriesRef.current = [];
  };

  const handleChartTypeChange = (chart: IChartApi, type: "line" | "candle") => {
    clearSeries(chart);
    setChartType(type);

    switch (type) {
      case "line":
        const baselineSeries = chart.addBaselineSeries({
          baseValue: { type: "price", price: latest.preClose },
          topLineColor: "rgba(46, 139, 87, 1)",
          topFillColor1: "rgba(46, 139, 87, 0.05)",
          topFillColor2: "rgba(46, 139, 87, 0.28)",
          bottomLineColor: "rgba(236, 64, 64, 1)",
          bottomFillColor1: "rgba(236, 64, 64, 0.28)",
          bottomFillColor2: "rgba(236, 64, 64, 0.05)"
        });

        const baselineData = trends.map(item => ({
          time: dayjs(item.date).unix() as UTCTimestamp,
          value: item.close
        }));

        baselineSeries.setData(baselineData);
        seriesRef.current.push(baselineSeries);
        break;
      case "candle":
        const candleSeries = chart.addCandlestickSeries();

        const candleData = trends.map(item => ({
          time: dayjs(item.date).unix() as UTCTimestamp,
          ...item
        }));

        candleSeries.setData(candleData);
        seriesRef.current.push(candleSeries);
        break;
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleChartResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current!.clientWidth
        });
      }
    };

    const chart = createSymbolChart(chartContainerRef.current);

    chartRef.current = chart;

    chart.timeScale().fitContent();

    handleChartTypeChange(chart, chartType);

    window.addEventListener("resize", handleChartResize);

    return () => {
      chart.remove();
      window.removeEventListener("resize", handleChartResize);
    };
  }, [code, trends]);

  return (
    <Stack>
      <div
        ref={chartContainerRef}
        style={{ position: "relative", width: "100%", height: "300px" }}
      ></div>

      <Group justify="flex-end">
        <SegmentedControl
          w={rem(120)}
          value={chartType}
          onChange={value =>
            handleChartTypeChange(chartRef.current!, value as "line" | "candle")
          }
          data={[
            { value: "line", label: <IconChartLine size={16} /> },
            { value: "candle", label: <IconChartCandle size={16} /> }
          ]}
        />
      </Group>
    </Stack>
  );
};

export default SymbolChart;
