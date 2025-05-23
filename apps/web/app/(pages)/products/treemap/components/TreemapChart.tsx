import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { StockQuotes } from "@prisma/client";
import { getThemeSetting } from "@/app/utils/theme";
import {
  getColor,
  formatPercent,
  formatNumber,
  formatLargeNumber
} from "@/app/utils/formatters";
import { StockTreemap } from "@/app/api/(stock)/stock-treemap/list/route";
import {
  MarketType,
  TreemapSortType,
  getMarketLabel,
  getTreemapSortLabel
} from "@trade-signal/shared";
import dayjs from "dayjs";

interface TreemapChartProps {
  data: StockTreemap[];
  height: number;
  marketType: string;
  sortType: TreemapSortType;
}

export const TreemapChart = ({
  data,
  height,
  marketType,
  sortType
}: TreemapChartProps) => {
  const { colorScheme, upColor, downColor } = getThemeSetting();

  // 提取计算显示值的逻辑
  const calculateDisplayValue = (stock: StockQuotes | StockTreemap): number => {
    let value = stock[sortType];

    // 根据不同指标添加权重系数
    switch (sortType) {
      case "changeRate":
      case "turnoverRate":
        // 涨跌幅和换手率取绝对值后放大，保持正负值都能显示
        value = Math.abs(value) * 100;
        break;
      case "dealAmount":
      case "volume":
      case "totalMarketCap":
      case "freeCap":
        // 金额类指标使用平方根压缩，保持适度差异
        value = Math.sqrt(Math.max(value, 1));
        break;
      default:
        // 其他指标保持原值
        break;
    }

    return value;
  };

  // 提取 tooltip 格式化函数
  const formatTooltip = (info: any) => {
    const data = info.data;
    if (!data || !data.name) return null;

    if (data.children) {
      return `
        <div style="font-weight: bold; margin-bottom: 4px;">
          ${data.name} (${data.code})
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>涨跌幅</span>
          <span style="color: ${getColor(data.changeRate)}">
            ${formatPercent(data.changeRate)}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>涨跌额</span>
          <span style="color: ${getColor(data.upsDowns)}">
            ${formatNumber(data.upsDowns, 2)}
          </span>
        </div>
        <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #666;">
          <div style="display: flex; justify-content: space-between;">
            <span>上涨家数</span>
            <span style="color: ${upColor}">${data.upCount}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>下跌家数</span>
            <span style="color: ${downColor}">${data.downCount}</span>
          </div>
        </div>
        <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #666;">
          <div style="display: flex; justify-content: space-between;">
            <span>总市值</span>
            <span>${formatLargeNumber(data.totalMarketCap)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>流通市值</span>
            <span>${formatLargeNumber(data.freeCap)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>成交额</span>
            <span>${formatLargeNumber(data.dealAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>换手率</span>
            <span style="color: ${getColor(data.turnoverRate)}">
              ${formatPercent(data.turnoverRate)}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>成交量</span>
            <span>${formatLargeNumber(data.volume)}</span>
          </div>
        </div>
      `;
    }

    return `
      <div style="font-weight: bold; margin-bottom: 4px;">
        ${data.name} (${data.code})
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>最新价</span>
        <span>${formatNumber(data.newPrice, 2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>涨跌幅</span>
        <span style="color: ${getColor(data.changeRate)}">
          ${formatPercent(data.changeRate)}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>涨跌额</span>
        <span style="color: ${getColor(data.upsDowns)}">
          ${formatNumber(data.upsDowns, 2)}
        </span>
      </div>
      <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #666;">
        <div style="display: flex; justify-content: space-between;">
          <span>成交额</span>
          <span>${formatLargeNumber(data.dealAmount)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>成交量</span>
          <span>${formatLargeNumber(data.volume)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>换手率</span>
          <span style="color: ${getColor(data.turnoverRate)}">
            ${formatPercent(data.turnoverRate)}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>量比</span>
          <span style="color: ${getColor(data.volumeRatio)}">
            ${formatNumber(data.volumeRatio, 2)}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>振幅</span>
          <span style="color: ${getColor(data.amplitude)}">
            ${formatPercent(data.amplitude)}
          </span>
        </div>
      </div>
      <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #666;">
        <div style="display: flex; justify-content: space-between;">
          <span>市盈率(动)</span>
          <span>${formatNumber(data.dtsyl, 2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>市盈率(TTM)</span>
          <span>${formatNumber(data.pe9, 2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>市净率</span>
          <span>${formatNumber(data.pbnewmrq, 2)}</span>
        </div>
      </div>
      <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #666;">
        <div style="display: flex; justify-content: space-between;">
          <span>总市值</span>
          <span>${formatLargeNumber(data.totalMarketCap)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>流通市值</span>
          <span>${formatLargeNumber(data.freeCap)}</span>
        </div>
      </div>
    `;
  };

  // 优化 options 配置
  const options = useMemo(() => {
    if (!data) return {};

    const getColorByChangeRate = (changeRate: number): string =>
      changeRate === 0 ? "#808080" : changeRate > 0 ? upColor : downColor;

    const processData = (data: StockTreemap[]) => {
      return data.map(plate => ({
        ...plate,
        value: calculateDisplayValue(plate),
        children: plate.children.map(stock => ({
          value: calculateDisplayValue(stock),
          ...stock,
          itemStyle: {
            color: getColorByChangeRate(stock.changeRate)
          }
        }))
      }));
    };

    const color = colorScheme === "dark" ? "#fff" : "#333";
    const borderColor = colorScheme === "dark" ? "#333" : "#fff";
    const backgroundColor =
      colorScheme === "dark"
        ? "rgba(255, 255, 255, 0.9)"
        : "rgba(50, 50, 50, 0.9)";

    const saveImageTitle = useMemo(() => {
      const marketLabel = getMarketLabel(marketType as MarketType);
      const sortLabel = getTreemapSortLabel(sortType);
      const date = dayjs().format("YYYY-MM-DD");
      const time = dayjs().format("HH:mm:ss");
      return `${marketLabel}_${sortLabel}_${date}_${time}`;
    }, [marketType, sortType]);

    return {
      tooltip: {
        backgroundColor: "rgba(50, 50, 50, 0.9)",
        borderColor: "#333",
        textStyle: {
          color: "#fff",
          fontSize: 13,
          lineHeight: 20
        },
        extraCssText: "min-width: 140px;", // 设置最小宽度
        formatter: formatTooltip
      },
      toolbox: {
        show: true,
        padding: [20, 20],
        top: 10,
        right: 10,
        backgroundColor: backgroundColor,
        iconStyle: {
          color,
          borderColor,
          borderWidth: 1
        },
        emphasis: {
          iconStyle: {
            color,
            borderColor
          }
        },
        feature: {
          dataZoom: {
            type: "dataZoom",
            show: true,
            title: null
          },
          restore: {
            type: "restore",
            show: true,
            title: null
          },
          saveAsImage: {
            show: true,
            name: saveImageTitle,
            type: "png",
            title: null
          }
        }
      },
      series: [
        {
          type: "treemap",
          data: processData(data),
          width: "100%",
          height: "100%",
          roam: true,
          nodeClick: false,
          breadcrumb: { show: false },
          animation: false,
          progressive: 100,
          progressiveThreshold: 500,
          silent: false,
          throttle: 100,
          label: {
            show: true,
            formatter: (params: any) => {
              if (params.data.children) {
                return `${params.name} (${params.data.code})`;
              }
              return `${params.name}\n${params.data.changeRate?.toFixed(2)}%`;
            },
            fontSize: 12,
            color: "#fff",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          },
          upperLabel: {
            show: true,
            height: 30,
            backgroundColor: "rgba(0,0,0,0.3)",
            color: "#fff",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            padding: [5, 5]
          },
          levels: [
            {
              itemStyle: {
                borderColor: "#333",
                borderWidth: 2,
                gapWidth: 2,
                borderRadius: 4
              },
              upperLabel: {
                show: false
              }
            },
            {
              itemStyle: {
                borderColor: "rgba(255,255,255,0.2)",
                borderWidth: 1,
                gapWidth: 1,
                borderRadius: 2
              },
              label: {
                show: false,
                fontSize: 12,
                color: "#fff"
              }
            }
          ],
          emphasis: {
            label: {
              fontSize: 14,
              fontWeight: "bold"
            }
          }
        }
      ]
    };
  }, [data, colorScheme, upColor, downColor, marketType, sortType]);

  return (
    <ReactECharts
      option={options}
      style={{ height, width: "100%" }}
      opts={{
        renderer: "canvas",
        devicePixelRatio: window.devicePixelRatio
      }}
    />
  );
};
