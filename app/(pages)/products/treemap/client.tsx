"use client";

import { useMemo, useState } from "react";
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
import dayjs from "dayjs";

import { TreemapChart } from "./components/TreemapChart";

const MARKET_OPTIONS = [
  { label: "沪京深A股", value: "all" },
  { label: "上证A股", value: "sh" },
  { label: "深证A股", value: "sz" },
  { label: "北证A股", value: "bj" }
] as { label: string; value: string }[];

const TreemapChartClient = () => {
  const { width, height } = useViewportSize();
  const { task } = useSyncTaskContext();

  const currentThemeColor = getCurrentThemeColor();
  const [marketType, setMarketType] = useState("all");

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

  const { data, isLoading } = useQuery({
    queryKey: ["treemap", marketType],
    queryFn: (): Promise<StockTreemap[]> =>
      clientGet("/api/stock-treemap/list", { marketType })
  });

  if (isLoading || !data) {
    return (
      <Paper>
        <Group align="flex-start">
          <Paper mt={20} p="md" style={{ width: 200 }}>
            <Skeleton height={160} />
            <Skeleton height={160} mt={20} />
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
          <Text ml={2} size="sm" fw={500}>
            {refreshTime}
          </Text>
          <SegmentedControl
            p="sm"
            mt={20}
            fullWidth
            color={currentThemeColor}
            orientation="vertical"
            value={marketType}
            withItemsBorders={false}
            onChange={setMarketType}
            data={MARKET_OPTIONS}
          />
          <Stack ml={2} mt={20} gap="xs">
            <Text size="sm" fw={500}>
              操作提示
            </Text>
            <List size="sm">
              <List.Item>面积代表总市值</List.Item>
              <List.Item>颜色代表涨跌幅度</List.Item>
              <List.Item>支持悬浮查看详情</List.Item>
              <List.Item>支持滚动拖动鼠标</List.Item>
            </List>
          </Stack>
        </Paper>
        <Paper p="xs" shadow="sm" style={{ flex: 1 }}>
          <TreemapChart data={data} height={treemapH} marketType={marketType} />
        </Paper>
      </Group>
    </Paper>
  );
};

export default TreemapChartClient;
