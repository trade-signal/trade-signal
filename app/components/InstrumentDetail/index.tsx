import dayjs from "dayjs";
import { useEffect } from "react";
import { clientGet } from "@/shared/request";
import { StockQuotesRealTime } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Group, Loader, rem, Stack, Text } from "@mantine/core";
import { useActiveStock } from "@/app/providers/ActiveStockContent";
import { useLoginContext } from "@/app/providers/LoginProvider";
import { formatNumber, getColor } from "../tables/DataTable/util";
import { formatPercentPlain } from "../tables/DataTable/util";

const InstrumentDetail = () => {
  const { activeStockCode, setActiveStockCode } = useActiveStock();
  const { userInfo } = useLoginContext();

  const {
    data: stock,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["instrumentDetail"],
    queryFn: () =>
      clientGet("/api/watchlist/item", {
        code: activeStockCode || ""
      }) as Promise<StockQuotesRealTime>,
    enabled: !!userInfo
  });

  useEffect(() => {
    if (!activeStockCode || !userInfo) return;
    if (stock?.code === activeStockCode) return;

    refetch();
  }, [activeStockCode, userInfo]);

  useEffect(() => {
    if (!stock) return;

    if (activeStockCode !== stock.code) {
      setActiveStockCode(stock.code);
    }
  }, [stock]);

  if (!userInfo) {
    return null;
  }

  if (isLoading) {
    return (
      <Stack h={"48vh"} justify="center" align="center">
        <Loader size="xs" />
      </Stack>
    );
  }

  return (
    <Stack gap={0} p="xs" style={{ background: "white" }} h={"48vh"}>
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
