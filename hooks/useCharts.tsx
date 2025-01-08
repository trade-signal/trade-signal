import dayjs from "dayjs";
import { createChart, IChartApi } from "lightweight-charts";

import type { ICustomToolTipConfig, ICustomChartConfig } from "@/types";
import type { ChartOptions, DeepPartial, ColorType, MouseEventParams } from "lightweight-charts";

/**
 * @description 自定义 Charts Hooks
 * @param { HTMLDivElement } ref
 */
export const useCharts = (ref: HTMLDivElement, config?: ICustomChartConfig) => {
  let chartInstance: IChartApi;

  const handleChartResize = () => {
    chartInstance.applyOptions({
      width: ref.clientWidth
    });
  };

  const initWindowsEvent = () => {
    window.addEventListener("resize", handleChartResize);
  };

  const init = (): IChartApi => {
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
      handleScale: false,
      handleScroll: false,
      grid: {
        vertLines: {
          visible: false
        },
        horzLines: {
          visible: false
        }
      }
    };

    initWindowsEvent()

    return createChart(ref, chartOptions);
  };

  // 卸载事件
  const unmount = () => {
    chartInstance.remove();
    window.removeEventListener("resize", handleChartResize);
  };
  
  const createCustomChart = (config: DeepPartial<ChartOptions>) => {
    const chartOptions: DeepPartial<ChartOptions> = { ...config };

    return createChart(ref, chartOptions);
  };

  const createToolTip = (config: ICustomToolTipConfig) => {
    const toolTip = document.createElement("div");

    const toolTipWidth = 80;
    const toolTipHeight = 80;
    const toolTipMargin = 15;

    // TODO 后续也通过自定义的方式
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
      background: black;
      color: white;
      border-color: transparent;
    `;

    ref.appendChild(toolTip);

    chartInstance.subscribeCrosshairMove((param: MouseEventParams) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > ref.clientWidth ||
        param.point.y < 0 ||
        param.point.y > ref.clientHeight
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
  
      // TODO
      // const color = getChartColor(price, latest, chartType);
      const color = '#ec4040';
  
      const dateStr = dayjs
        .unix(param.time as number)
        .format("YYYY-MM-DD HH:mm:ss");
  
      toolTip.style.display = "block";
      toolTip.innerHTML = `
        <div style="color: ${color}">${config.name}</div>
        <div style="font-size: 24px; margin: 4px 0px; color: white">
          ${Math.round(100 * price) / 100}
        </div>
        <div style="color: white">
          ${dateStr}
        </div>
      `;
  
      const y = param.point.y;
  
      let left = param.point.x + toolTipMargin;
      if (left > ref.clientWidth - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth;
      }
  
      let top = y + toolTipMargin;
      if (top > ref.clientHeight - toolTipHeight) {
        top = y - toolTipHeight - toolTipMargin;
      }
  
      toolTip.style.left = `${left}px`;
      toolTip.style.top = `${top}px`;
    });
  };

  // 不存在自定义配置则进行默认初始化
  if (!config) {
    chartInstance = init();

    return {
      unmount,
      chartInstance,
      createToolTip,
      createCustomChart
    };
  }

  return {
    createToolTip,
    createCustomChart
  };
};
