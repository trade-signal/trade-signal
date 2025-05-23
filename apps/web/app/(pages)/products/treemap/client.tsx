"use client";

import { useMemo, useState } from "react";
import { useViewportSize } from "@mantine/hooks";
import {
  Skeleton,
  Paper,
  Group,
  Text,
  Stack,
  List,
  Title
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet, formatDateDiff } from "@trade-signal/shared";
import {
  MARKET_OPTIONS,
  MarketType,
  TREEMAP_SORT_OPTIONS,
  TreemapSortType
} from "@trade-signal/shared";

import { StockTreemap } from "@/app/api/(stock)/stock-treemap/list/route";
import ScreenerSelect from "@/app/components/ScreenerSelect";
import { TreemapChart } from "./components/TreemapChart";

const TreemapChartClient = () => {
  const { width, height } = useViewportSize();

  const [marketType, setMarketType] = useState("all");
  const [sortType, setSortType] = useState("totalMarketCap");

  const [data, setData] = useState<StockTreemap[]>([]);

  const { treemapH } = useMemo(
    () => ({
      treemapW: Math.max(width - 48, 800),
      treemapH: Math.max(height - 150, 600)
    }),
    [width, height]
  );

  const { isLoading } = useQuery({
    queryKey: ["treemap", marketType],
    queryFn: (): Promise<StockTreemap[]> =>
      clientGet("/api/stock-treemap/list", { marketType }),
    onSuccess: data => {
      setData(data);
    }
  });

  if (isLoading && !data.length) {
    return (
      <Paper>
        <Group align="flex-start">
          <Paper mt={20} p="md" style={{ width: 200 }}>
            <Skeleton w={180} h={180} />
            <Skeleton w={180} h={300} mt={20} />
          </Paper>
          <Paper p="md" style={{ flex: 1 }}>
            <Skeleton height={treemapH} />
          </Paper>
        </Group>
      </Paper>
    );
  }

  const { date } = formatDateDiff(data[0]?.createdAt);

  return (
    <Paper mt={20} bg="transparent">
      <Group align="flex-start">
        <Paper p="xs" style={{ width: 240 }}>
          <Title order={5}>板块热力图</Title>

          <Stack mt={10} gap={2}>
            <Text span size="sm">
              数据来源：东方财富
            </Text>
            <Text span size="sm">
              更新时间：{date}
            </Text>
          </Stack>

          <Stack mt={20}>
            <ScreenerSelect
              title="市场"
              width={180}
              justify="start"
              value={marketType}
              data={MARKET_OPTIONS}
              onChange={value => setMarketType(value as MarketType)}
            />

            <ScreenerSelect
              title="指标"
              width={180}
              justify="start"
              value={sortType}
              data={TREEMAP_SORT_OPTIONS}
              onChange={value => setSortType(value as TreemapSortType)}
            />
          </Stack>

          <Stack mt={20}>
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                指标说明
              </Text>
              <List size="sm">
                <List.Item>金额类指标使用平方根压缩，保持适度差异</List.Item>
                <List.Item>
                  涨跌幅和换手率取绝对值后放大，保持正负值都能显示
                </List.Item>
                <List.Item>
                  板块/个股颜色根据涨跌幅变化，涨的为绿色，跌的为红色
                </List.Item>
              </List>
            </Stack>

            <Text size="sm" fw={500}>
              操作提示
            </Text>
            <List size="sm">
              <List.Item>支持悬浮查看详情</List.Item>
              <List.Item>支持下钻查看个股</List.Item>
              <List.Item>支持滚动拖动鼠标</List.Item>
              <List.Item>支持保存图片</List.Item>
            </List>
          </Stack>
        </Paper>
        <Paper p="xs" shadow="sm" style={{ flex: 1 }}>
          <TreemapChart
            data={data}
            height={treemapH}
            marketType={marketType}
            sortType={sortType as TreemapSortType}
          />
        </Paper>
      </Group>
    </Paper>
  );
};

export default TreemapChartClient;
