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
import { Group, rem, SegmentedControl, Stack, Tooltip } from "@mantine/core";
import { IconChartCandle } from "@tabler/icons-react";
import { IconChartArea } from "@tabler/icons-react";

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

const SymbolChart = (props: SymbolChartProps) => {
  const { code, name, latest, trends } = props;

  const [chartType, setChartType] = useState<"area" | "candle">("area");

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
      },
      // disable zoom
      handleScale: false,
      // disable scroll
      handleScroll: false,
      // hide grid lines
      grid: {
        vertLines: {
          visible: false
        },
        horzLines: {
          visible: false
        }
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

        const areaData = trends.map(item => ({
          time: dayjs(item.date).unix() as UTCTimestamp,
          value: item.close
        }));

        areaSeries.setData(areaData);
        seriesRef.current.push(areaSeries);
        break;
      case "candle":
        const candleSeries = chart.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350"
        });

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
            handleChartTypeChange(chartRef.current!, value as "area" | "candle")
          }
          data={[
            {
              value: "area",
              label: (
                <Tooltip label="面积图" position="top" withArrow>
                  <div>
                    <IconChartArea size={16} />
                  </div>
                </Tooltip>
              )
            },
            {
              value: "candle",
              label: (
                <Tooltip label="蜡烛图" position="top" withArrow>
                  <div>
                    <IconChartCandle size={16} />
                  </div>
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
