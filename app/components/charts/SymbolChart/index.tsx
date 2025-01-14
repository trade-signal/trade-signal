import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  ColorType,
  DeepPartial,
  MouseEventParams,
  PriceScaleMode
} from "lightweight-charts";
import dayjs from "dayjs";
import { Group, rem, SegmentedControl, Stack, Tooltip } from "@mantine/core";
import { IconChartCandle } from "@tabler/icons-react";
import { IconChartArea } from "@tabler/icons-react";
import { readLocalStorageValue } from "@mantine/hooks";
import { THEME_SETTING_KEY, ThemeSetting } from "@/app/hooks/useThemeSetting";
import { hex2rgba } from "@/shared/util";
import { useThemeIcon } from "@/app/hooks/useThemeIcon";

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
  const themeSetting: ThemeSetting = readLocalStorageValue({
    key: THEME_SETTING_KEY
  });

  if (chartType === "area") {
    return latest.close > latest.preClose
      ? themeSetting.upColor ?? "rgba(236, 64, 64, 1)"
      : themeSetting.downColor ?? "rgba(46, 139, 87, 1)";
  } else {
    return price > latest.preClose
      ? themeSetting.upColor ?? "#ec4040"
      : themeSetting.downColor ?? "#2e8b57";
  }
};

interface TooltipProps {
  chart: IChartApi;
  container: HTMLDivElement;
  name: string;
  latest: SymbolChartData;
  chartType: "area" | "candle";
  isDark: boolean;
}

const createTooltip = (props: TooltipProps) => {
  const { chart, container, name, latest, chartType, isDark } = props;

  const toolTip = document.createElement("div");

  const toolTipWidth = 80;
  const toolTipHeight = 80;
  const toolTipMargin = 15;

  const bgColor = isDark ? "white" : "black";
  const textColor = isDark ? "black" : "white";

  toolTip.style.cssText = `
    position: absolute;
    display: none;
    padding: 8px;
    box-sizing: border-box;
    font-size: 12px;
    text-align: left;
    z-index: 1000;
    top: 12px;
    left: 12px;
    pointer-events: none;
    border: 1px solid;
    border-radius: 2px;
    font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${bgColor};
    color: ${textColor};
    border-color: transparent;
  `;

  container.appendChild(toolTip);

  chart.subscribeCrosshairMove((param: MouseEventParams) => {
    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > container.clientWidth ||
      param.point.y < 0 ||
      param.point.y > container.clientHeight
    ) {
      toolTip.style.display = "none";
      return;
    }

    const series = Array.from(param.seriesData.values())[0];
    if (!series) return;

    // TODO
    // @ts-ignore
    const price = series.value ?? series.close;
    if (typeof price !== "number") return;

    const color = getChartColor(price, latest, chartType);

    const dateStr = dayjs
      .unix(param.time as number)
      .format("YYYY-MM-DD HH:mm:ss");

    toolTip.style.display = "block";
    toolTip.innerHTML = `
      <div style="color: ${color}">${name}</div>
      <div style="font-size: 24px; margin: 4px 0px; color: ${textColor}">
        ${Math.round(100 * price) / 100}
      </div>
      <div style="color: ${textColor}">${dateStr}</div>
    `;

    const y = param.point.y;

    let left = param.point.x + toolTipMargin;
    if (left > container.clientWidth - toolTipWidth) {
      left = param.point.x - toolTipMargin - toolTipWidth;
    }

    let top = y + toolTipMargin;
    if (top > container.clientHeight - toolTipHeight) {
      top = y - toolTipHeight - toolTipMargin;
    }

    toolTip.style.left = `${left}px`;
    toolTip.style.top = `${top}px`;
  });

  return toolTip;
};

const SymbolChart = (props: SymbolChartProps) => {
  const { code, name, latest, trends } = props;

  const { isDark } = useThemeIcon();

  const [chartType, setChartType] = useState<"area" | "candle">("area");

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any, any>[]>([]);

  const createSymbolChart = (chartContainerRef: HTMLDivElement) => {
    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: isDark ? "white" : "black",
        background: {
          type: "solid" as ColorType,
          color: isDark ? "black" : "white"
        },
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

    const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });

    switch (type) {
      case "area":
        const areaSeries = chart.addAreaSeries({
          lineColor:
            latest.close > latest.preClose
              ? hex2rgba(themeSetting.upColor ?? "#ec4040")
              : hex2rgba(themeSetting.downColor ?? "#2e8b57"),
          topColor:
            latest.close > latest.preClose
              ? hex2rgba(themeSetting.upColor ?? "#ec4040", 0.28)
              : hex2rgba(themeSetting.downColor ?? "#2e8b57", 0.28),
          bottomColor:
            latest.close > latest.preClose
              ? hex2rgba(themeSetting.upColor ?? "#ec4040", 0.05)
              : hex2rgba(themeSetting.downColor ?? "#2e8b57", 0.05)
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
          upColor: themeSetting.upColor ?? "#ec4040",
          downColor: themeSetting.downColor ?? "#2e8b57",
          borderVisible: false,
          wickVisible: false, // temp: 隐藏蜡烛图的线
          wickUpColor: themeSetting.upColor ?? "#ec4040",
          wickDownColor: themeSetting.downColor ?? "#2e8b57"
        });

        const candleData = trends
          .map(item => ({
            time: dayjs(item.date).unix() as UTCTimestamp,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            color:
              item.close > item.preClose
                ? themeSetting.upColor ?? "#ec4040"
                : themeSetting.downColor ?? "#2e8b57"
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

    const handleChartResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current!.clientWidth
        });
      }
    };

    const chart = createSymbolChart(chartContainerRef.current);

    createTooltip({
      chart,
      container: chartContainerRef.current,
      name,
      latest,
      chartType,
      isDark
    });

    chartRef.current = chart;

    chart.timeScale().fitContent();

    handleChartTypeChange(chart, chartType);

    window.addEventListener("resize", handleChartResize);

    return () => {
      chart.remove();
      window.removeEventListener("resize", handleChartResize);
    };
  }, [code, trends, name, chartType, isDark]);

  return (
    <Stack>
      <div
        ref={chartContainerRef}
        style={{ position: "relative", width: "100%", height: "320px" }}
      ></div>

      {/* <Group justify="flex-end">
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
      </Group> */}
    </Stack>
  );
};

export default SymbolChart;
