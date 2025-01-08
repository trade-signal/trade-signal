import { useEffect, useRef, useState } from "react";
import {
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  ColorType,
  DeepPartial,
  MouseEventParams,
  SeriesType,
  BarData,
  Time
} from "lightweight-charts";
import dayjs from "dayjs";
import { Group, rem, SegmentedControl, Stack, Tooltip } from "@mantine/core";
import { IconChartCandle } from "@tabler/icons-react";
import { IconChartArea } from "@tabler/icons-react";
import { useCharts } from "@/hooks/useCharts";

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

const getChartColor = (
  price: number,
  latest: SymbolChartData,
  chartType: "area" | "candle"
) => {
  if (chartType === "area") {
    return latest.close > latest.preClose
      ? "rgba(236, 64, 64, 1)"
      : "rgba(46, 139, 87, 1)";
  } else {
    return price > latest.preClose ? "#ec4040" : "#2e8b57";
  }
};

const SymbolChart = (props: SymbolChartProps) => {
  const { code, name, latest, trends } = props;

  const [chartType, setChartType] = useState<"area" | "candle">("area");

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any, any>[]>([]);  


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

  const handleChartTypeChange = (chart: IChartApi, type: "area" | "candle") => {
    clearSeries(chart);
    setChartType(type);

    switch (type) {
      case "area":
        const areaSeries = chart.addAreaSeries({
          lineColor:
            latest.close > latest.preClose
              ? "rgba(236, 64, 64, 1)"
              : "rgba(46, 139, 87, 1)",
          topColor:
            latest.close > latest.preClose
              ? "rgba(236, 64, 64, 0.28)"
              : "rgba(46, 139, 87, 0.28)",
          bottomColor:
            latest.close > latest.preClose
              ? "rgba(236, 64, 64, 0.05)"
              : "rgba(46, 139, 87, 0.05)"
        });

        const areaData = trends
          .map(item => ({
            time: dayjs(item.date).unix() as UTCTimestamp,
            value: item.close
          }))
          .filter(item => item.value !== 0);

        areaSeries.setData(areaData);
        seriesRef.current.push(areaSeries);
        break;
      case "candle":
        const candleSeries = chart.addCandlestickSeries({
          upColor: "#ec4040",
          downColor: "#2e8b57",
          borderVisible: false,
          wickUpColor: "#ec4040",
          wickDownColor: "#2e8b57"
        });

        const candleData = trends
          .map(item => ({
            time: dayjs(item.date).unix() as UTCTimestamp,
            ...item
          }))
          .filter(
            item =>
              item.open !== 0 &&
              item.high !== 0 &&
              item.low !== 0 &&
              item.close !== 0
          );

        candleSeries.setData(candleData);
        seriesRef.current.push(candleSeries);
        break;
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const { createToolTip, chartInstance, unmount } = useCharts(chartContainerRef.current);

    if (chartInstance) {
      chartRef.current = chartInstance;

      createToolTip({
        name,
        latest,
        chartType
      });

      // createTooltip(chartInstance, chartContainerRef.current, name, latest, chartType);
    
      chartInstance.timeScale().fitContent();

      handleChartTypeChange(chartInstance, chartType);

      return () => {
        chartInstance.remove();
        window.removeEventListener("resize", unmount);
      };

    }
  }, [code, trends, name, chartType]);

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
            handleChartTypeChange(chartRef.current!, value as "area" | "candle")
          }
          data={[
            {
              value: "area",
              label: (
                <Tooltip label="面积图" position="top" withArrow>
                  <IconChartArea size={16} />
                </Tooltip>
              )
            },
            {
              value: "candle",
              label: (
                <Tooltip label="k 线图" position="top" withArrow>
                  <IconChartCandle size={16} />
                </Tooltip>
              )
            }
          ]}
        />
      </Group>
    </Stack>
  );
};

export default SymbolChart;
