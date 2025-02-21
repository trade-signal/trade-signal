"use client";

import { useMemo, useState } from "react";
import { Treemap, Tooltip } from "recharts";
import { useViewportSize } from "@mantine/hooks";
import { Skeleton, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";
import { getThemeSetting, generateRangeColors } from "@/shared/theme";

import { StockTreemap } from "@/app/api/(stock)/stock-treemap/list/route";
import StockCustomizedContent from "./components/StockCustomizedContent";

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
    return generateRangeColors(upColor, downColor, 7);
  }, [upColor, downColor]);

  const { data, isLoading } = useQuery({
    queryKey: ["treemap"],
    queryFn: (): Promise<StockTreemap[]> =>
      clientGet("/api/stock-treemap/list", {
        orderBy
      })
  });

  if (isLoading) {
    return <Skeleton mt={20} height={treemapH} width={treemapW} />;
  }

  return (
    <Stack mt={20}>
      <Treemap
        width={treemapW}
        height={treemapH}
        data={data}
        dataKey={orderBy}
        stroke="#fff"
        fill="#8884d8"
        isAnimationActive={false}
        // @ts-ignore
        content={<StockCustomizedContent colors={colors} />}
      >
        <Tooltip />
      </Treemap>
    </Stack>
  );
};

export default TreemapChartClient;
