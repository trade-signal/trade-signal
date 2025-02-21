"use client";

import { useMemo, useState } from "react";
import { Treemap, Tooltip } from "recharts";
import { StockQuotes } from "@prisma/client";
import { useViewportSize } from "@mantine/hooks";
import { Skeleton, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";

import { StockTreemap } from "@/app/api/(stock)/stock-treemap/list/route";
import CustomizedContent from "./components/CustomizedContent";
import { getThemeSetting, generateRangeColors } from "@/shared/theme";

const TreemapChartClient = () => {
  const { width, height } = useViewportSize();
  const { upColor, downColor } = getThemeSetting();
  const [orderBy, setOrderBy] = useState("changeRate");

  // 先计算 treemap 的尺寸
  const { treemapW, treemapH } = useMemo(() => {
    return {
      treemapW: width - 200,
      treemapH: height - 200
    };
  }, [width, height]);

  // 生成颜色区间
  const colors = useMemo(() => {
    return generateRangeColors(downColor, upColor, 6);
  }, [upColor, downColor]);

  const { data, isLoading } = useQuery({
    queryKey: ["treemap"],
    queryFn: (): Promise<StockTreemap[]> =>
      clientGet("/api/stock-treemap/list", {
        orderBy
      })
  });

  const treemapData = useMemo(() => {
    return data?.map(item => ({
      ...item,
      children: item.stocks.map(stock => ({
        name: stock.name,
        size: stock.changeRate
      }))
    }));
  }, [data]);

  if (isLoading) {
    return <Skeleton mt={20} height={treemapH} width={treemapW} />;
  }

  return (
    <Stack mt={20}>
      <Treemap
        width={treemapW}
        height={treemapH}
        data={treemapData}
        dataKey="size"
        stroke="#fff"
        fill="#8884d8"
        // @ts-ignore
        content={<CustomizedContent data={treemapData} colors={colors} />}
      >
        <Tooltip />
      </Treemap>
    </Stack>
  );
};

export default TreemapChartClient;
