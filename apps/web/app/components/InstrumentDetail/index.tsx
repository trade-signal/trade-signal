import dayjs from "dayjs";
import { useEffect } from "react";
import { clientGet } from "@/packages/shared/request";
import { StockQuotes } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import {
  Group,
  Loader,
  rem,
  Stack,
  Text,
  Divider,
  ScrollArea,
  Spoiler
} from "@mantine/core";
import { useActiveStock } from "@/app/providers/ActiveStockProvider";
import { useLoginContext } from "@/app/providers/LoginProvider";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import {
  getColor,
  formatNumber,
  formatLargeNumber,
  formatPercent
} from "@/packages/shared/formatters";

import styles from "./index.module.css";

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
      }) as Promise<StockQuotes>,
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
      <Stack h={"49vh"} justify="center" align="center">
        <Loader size="xs" />
      </Stack>
    );
  }

  return (
    <ScrollArea
      offsetScrollbars
      p="xs"
      className={styles.instrumentDetailScrollArea}
      h={"49vh"}
    >
      <Stack gap="xs">
        <Text size="sm" fw={500}>
          {stock?.name} • {stock?.code}
        </Text>
        <Text size="xs" c="dimmed">
          {stock?.industry}
        </Text>
      </Stack>

      <Group gap={4} mt="lg" align="flex-end">
        <Text size={rem(32)} fw={600}>
          {formatNumber(stock?.newPrice || 0)}
        </Text>
        <Text ml="md" size="sm" c={getColor(stock?.upsDowns || 0)}>
          {formatNumber(stock?.upsDowns || 0)}
        </Text>
        <Text size="sm" c={getColor(stock?.changeRate || 0)}>
          {formatPercent(stock?.changeRate || 0)}
        </Text>
      </Group>

      <Text mt="sm" size="xs" c="dimmed">
        最后更新时间：{dayjs(stock?.createdAt).format("YYYY-MM-DD HH:mm")}
      </Text>

      <Stack mt="lg" gap="xs">
        <Text size="sm" fw={600}>
          关键统计
        </Text>
        <Spoiler
          // maxHeight={100}
          expanded={true}
          showLabel={<IconChevronDown size={14} />}
          hideLabel={<IconChevronUp size={14} />}
          styles={{
            control: {
              display: "none",
              padding: "4px 12px",
              background: "var(--mantine-color-gray-0)",
              borderRadius: "4px",
              fontSize: rem(14),
              transform: "translateX(100px)"
            }
          }}
        >
          <Group justify="space-between">
            <Text size="xs">成交量</Text>
            <Text size="xs" fw={600}>
              {formatLargeNumber(stock?.volume || 0)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs">成交额</Text>
            <Text size="xs" fw={600}>
              {formatLargeNumber(stock?.dealAmount || 0)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs">换手率</Text>
            <Text size="xs" fw={600}>
              {formatPercent(stock?.turnoverRate || 0)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs">量比</Text>
            <Text size="xs" fw={600}>
              {formatNumber(stock?.volumeRatio || 0)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs">振幅</Text>
            <Text size="xs" fw={600}>
              {formatPercent(stock?.amplitude || 0)}
            </Text>
          </Group>

          <Divider my="xs" />
          <Group justify="space-between">
            <Text size="xs">市盈率(TTM)</Text>
            <Text size="xs" fw={600}>
              {formatNumber(stock?.pe9 || 0)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs">市净率</Text>
            <Text size="xs" fw={600}>
              {formatNumber(stock?.pbnewmrq || 0)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs">基本每股收益(TTM)</Text>
            <Text size="xs" fw={600}>
              {formatLargeNumber(stock?.basicEps || 0)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs">每股净资产（元）</Text>
            <Text size="xs" fw={600}>
              {formatLargeNumber(stock?.bvps || 0)}
            </Text>
          </Group>

          <Divider my="xs" />
          <Group justify="space-between">
            <Text size="xs">总市值</Text>
            <Text size="xs" fw={600}>
              {formatLargeNumber(stock?.totalMarketCap || 0)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs">流通市值</Text>
            <Text size="xs" fw={600}>
              {formatLargeNumber(stock?.freeCap || 0)}
            </Text>
          </Group>
        </Spoiler>
      </Stack>
    </ScrollArea>
  );
};

export default InstrumentDetail;
