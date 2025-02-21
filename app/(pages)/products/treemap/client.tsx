"use client";

import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useViewportSize } from "@mantine/hooks";
import { Skeleton, SegmentedControl, Paper, Group } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";
import { getThemeSetting, getCurrentThemeColor } from "@/shared/theme";
import {
  getColor,
  formatPercent,
  formatNumber,
  formatLargeNumber
} from "@/shared/formatters";
import { StockTreemap } from "@/app/api/(stock)/stock-treemap/list/route";
import { StockQuotes } from "@prisma/client";

const TreemapChartClient = () => {
  const { width, height } = useViewportSize();

  const { upColor, downColor } = getThemeSetting();
  const currentThemeColor = getCurrentThemeColor();

  const [marketType, setMarketType] = useState("all");

  const MARKET_OPTIONS = [
    { label: "沪京深A股", value: "all" },
    { label: "上证A股", value: "sh" },
    { label: "深证A股", value: "sz" },
    { label: "北证A股", value: "bj" }
  ] as { label: string; value: string }[];

  const { treemapH } = useMemo(
    () => ({
      treemapW: Math.max(width - 48, 800),
      treemapH: Math.max(height - 150, 600)
    }),
    [width, height]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["treemap", marketType],
    queryFn: (): Promise<StockTreemap[]> =>
      clientGet("/api/stock-treemap/list", { marketType })
  });

  // 提取计算显示值的逻辑
  const calculateDisplayValue = (stock: StockQuotes): number => {
    return Math.log(stock.totalMarketCap || 1) * 100;
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
        value: plate.totalMarketCap,
        children: plate.children.map(stock => ({
          value: calculateDisplayValue(stock),
          ...stock,
          itemStyle: {
            color: getColorByChangeRate(stock.changeRate)
          }
        }))
      }));
    };

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
      series: [
        {
          type: "treemap",
          data: processData(data),
          width: "100%",
          height: "100%",
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
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
  }, [data, upColor, downColor, marketType]);

  if (isLoading || !data) {
    return (
      <Paper p="md" mt={20}>
        <Group align="flex-start">
          <Paper p="md" style={{ width: 160 }}>
            <Skeleton height={150} />
          </Paper>
          <Paper p="md" style={{ flex: 1 }}>
            <Skeleton height={treemapH} />
          </Paper>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper withBorder={false} bg="transparent">
      <Group mt={20} align="flex-start">
        <Paper p="md" style={{ width: 160 }}>
          <SegmentedControl
            fullWidth
            color={currentThemeColor}
            orientation="vertical"
            value={marketType}
            withItemsBorders={false}
            onChange={setMarketType}
            data={MARKET_OPTIONS}
          />
        </Paper>
        <Paper style={{ flex: 1 }}>
          <ReactECharts
            option={options}
            style={{ height: treemapH, width: "100%" }}
            opts={{ renderer: "canvas" }}
          />
        </Paper>
      </Group>
    </Paper>
  );
};

export default TreemapChartClient;
