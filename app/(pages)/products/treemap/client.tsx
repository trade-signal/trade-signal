"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useViewportSize } from "@mantine/hooks";
import {
  Skeleton,
  SegmentedControl,
  Paper,
  Group,
  Text,
  Stack,
  List
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";
import { getCurrentThemeColor } from "@/shared/theme";
import { StockTreemap } from "@/app/api/(stock)/stock-treemap/list/route";
import { useSyncTaskContext } from "@/app/providers/SyncTaskProvider";
import {
  MARKET_OPTIONS,
  MarketType,
  TREEMAP_SORT_OPTIONS,
  TreemapSortType
} from "@/shared/stock";

import ScreenerSelect from "@/app/components/ScreenerSelect";
import { TreemapChart } from "./components/TreemapChart";

const TreemapChartClient = () => {
  const { width, height } = useViewportSize();
  const { task } = useSyncTaskContext();

  const currentThemeColor = getCurrentThemeColor();

  const [marketType, setMarketType] = useState("all");
  const [sortType, setSortType] = useState("totalMarketCap");

  const [data, setData] = useState<StockTreemap[]>([]);

  const refreshTime = useMemo(() => {
    const currentBatch = task.find(
      (item: any) => item.taskType === "stock_plate_quotes"
    );
    return dayjs(currentBatch?.batchDate).format("YYYY-MM-DD HH:mm");
  }, [task]);

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
            <Skeleton w={180} h={160} />
            <Skeleton w={180} h={160} mt={20} />
          </Paper>
          <Paper p="md" style={{ flex: 1 }}>
            <Skeleton height={treemapH} />
          </Paper>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper mt={20} bg="transparent">
      <Group align="flex-start">
        <Paper p="xs" style={{ width: 200 }}>
          <Text span size="sm">
            数据更新时间：{dayjs(refreshTime).format("MM-DD HH:mm")}
          </Text>

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
              </List>
            </Stack>

            <Text size="sm" fw={500}>
              操作提示
            </Text>
            <List size="sm">
              <List.Item>支持悬浮查看详情</List.Item>
              <List.Item>支持滚动拖动鼠标</List.Item>
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
