import { clientGet } from "@/shared/request";
import { Group, Loader, rem, Stack, Text } from "@mantine/core";
import { useActiveStock } from "@/app/providers/ActiveStockContent";
import { StockQuotesRealTime } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatNumber, getColor } from "../tables/DataTable/util";
import { formatPercentPlain } from "../tables/DataTable/util";
import dayjs from "dayjs";
import { useEffect } from "react";

const InstrumentDetail = () => {
  const { activeStockCode } = useActiveStock();

  const {
    data: stock,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["instrumentDetail"],
    queryFn: () =>
      clientGet("/api/watchlist/item", {
        code: activeStockCode || ""
      }) as Promise<StockQuotesRealTime>
  });

  useEffect(() => {
    if (!activeStockCode) return;

    refetch();
  }, [activeStockCode]);

  if (isLoading) {
    return (
      <Stack h={"100%"} justify="center" align="center">
        <Loader size="xs" />
      </Stack>
    );
  }

  return (
    <Stack gap={0} p="xs" style={{ background: "white" }} h={"100%"}>
      <Stack gap={4}>
        <Text size="sm" fw={500}>
          {stock?.name} · {stock?.code}
        </Text>
        <Text size="xs" c="dimmed">
          {stock?.industry}
        </Text>
      </Stack>
      <Group mt="md" align="flex-end">
        <Text size={rem(32)} fw={600}>
          {formatNumber(stock?.newPrice || 0)}
        </Text>
        <Text size="sm" c={getColor(stock?.upsDowns || 0)}>
          {formatNumber(stock?.upsDowns || 0)}
        </Text>
        <Text size="sm" c={getColor(stock?.changeRate || 0)}>
          {formatPercentPlain(stock?.changeRate || 0)}
        </Text>
      </Group>
      <Text mt="sm" size="xs" c="dimmed">
        最后更新时间：{dayjs(stock?.createdAt).format("YYYY-MM-DD HH:mm")}
      </Text>
    </Stack>
  );
};

export default InstrumentDetail;
