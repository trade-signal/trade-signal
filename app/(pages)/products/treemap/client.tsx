"use client";

import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useViewportSize } from "@mantine/hooks";
import { Skeleton, Stack, SegmentedControl, Paper, Group } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";
import { getThemeSetting } from "@/shared/theme";

import { StockTreemap } from "@/app/api/(stock)/stock-treemap/list/route";

const TreemapChartClient = () => {
  const { width, height } = useViewportSize();
  const { upColor, downColor } = getThemeSetting();

  const [orderBy, setOrderBy] = useState("changeRate");

  const { treemapH } = useMemo(
    () => ({
      treemapW: Math.max(width - 48, 800), // 设置最小宽度
      treemapH: Math.max(height - 200, 600) // 设置最小高度
    }),
    [width, height]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["treemap", orderBy],
    queryFn: (): Promise<StockTreemap[]> =>
      clientGet("/api/stock-treemap/list", { orderBy })
  });

  // 处理数据和配置 ECharts 选项
  const options = useMemo(() => {
    if (!data) return {};

    const getColorByChangeRate = (changeRate: number): string => {
      if (changeRate === 0) return "#808080";
      if (changeRate > 0) {
        return upColor;
      }
      return downColor;
    };

    // 转换为 ECharts treemap 数据格式
    const processData = (data: StockTreemap[]) => {
      return data.map(plate => ({
        name: plate.name,
        value: plate.totalMarketCap,
        children: plate.children.map(stock => {
          let displayValue: number;

          switch (orderBy) {
            case "changeRate":
              displayValue = Math.abs(stock.changeRate) * 1000;
              break;
            case "totalMarketCap":
              displayValue = Math.log(stock.totalMarketCap || 1) * 100;
              break;
            case "volume":
              displayValue = Math.log(stock.volume || 1) * 100;
              break;
            case "dealAmount":
              displayValue = Math.log(stock.dealAmount || 1) * 100;
              break;
            default:
              displayValue = Math.log(stock.totalMarketCap || 1) * 100;
          }

          return {
            value: displayValue,
            ...stock,
            itemStyle: {
              color: getColorByChangeRate(stock.changeRate)
            }
          };
        })
      }));
    };

    return {
      tooltip: {
        backgroundColor: "rgba(50, 50, 50, 0.9)",
        borderColor: "#333",
        textStyle: {
          color: "#fff",
          fontSize: 14
        },
        formatter: (info: any) => {
          const data = info.data;
          return `
            <div style="font-weight: bold; margin-bottom: 4px;">
              ${data.name} (${data.code})
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>最新价</span>
              <span>${data.newPrice?.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>涨跌幅</span>
              <span style="color: ${data.changeRate > 0 ? upColor : downColor}">
                ${data.changeRate?.toFixed(2)}%
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>涨跌额</span>
              <span style="color: ${data.upsDowns > 0 ? upColor : downColor}">
                ${data.upsDowns?.toFixed(2)}
              </span>
            </div>
            <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #666;">
              <div style="display: flex; justify-content: space-between;">
                <span>成交额</span>
                <span>${(data.dealAmount / 100000000).toFixed(2)}亿</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>换手率</span>
                <span>${data.turnoverRate?.toFixed(2)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>振幅</span>
                <span>${data.amplitude?.toFixed(2)}%</span>
              </div>
            </div>
            <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #666;">
              <div style="display: flex; justify-content: space-between;">
                <span>市盈率(TTM)</span>
                <span>${data.pe9?.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>市净率</span>
                <span>${data.pbnewmrq?.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>总市值</span>
                <span>${(data.totalMarketCap / 100000000).toFixed(2)}亿</span>
              </div>
            </div>
          `;
        }
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
            padding: [5, 10]
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
                show: true,
                fontSize: 16,
                color: "#fff",
                fontWeight: "bold",
                backgroundColor: "rgba(0,0,0,0.5)",
                height: 40,
                formatter: (params: any) => {
                  return `${params.name}\n上涨${params.data.upCount} 下跌${params.data.downCount}`;
                }
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
                show: true,
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
  }, [data, upColor, downColor, orderBy]);

  if (isLoading) {
    return (
      <Paper shadow="sm" p="md" mt={20}>
        <Group align="flex-start">
          <Paper shadow="sm" p="md" withBorder style={{ width: 200 }}>
            <Skeleton height={150} />
          </Paper>
          <Paper shadow="sm" p="md" withBorder style={{ flex: 1 }}>
            <Skeleton height={treemapH} />
          </Paper>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="md" mt={20}>
      <Group align="flex-start">
        <Paper shadow="sm" p="md" withBorder style={{ width: 200 }}>
          <Stack>
            <SegmentedControl
              orientation="vertical"
              value={orderBy}
              onChange={setOrderBy}
              data={[
                { label: "按涨跌幅", value: "changeRate" },
                { label: "按市值", value: "totalMarketCap" },
                { label: "按成交量", value: "volume" },
                { label: "按成交额", value: "dealAmount" }
              ]}
            />
          </Stack>
        </Paper>
        <Paper shadow="sm" p="md" withBorder style={{ flex: 1 }}>
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
