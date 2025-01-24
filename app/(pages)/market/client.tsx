"use client";

import {
  Box,
  Center,
  Container,
  Group,
  rem,
  ScrollArea,
  Stack,
  Title
} from "@mantine/core";

import StockRanking from "./components/StockRanking";
import SymbolTabs from "./components/SymbolTabs";

import styles from "./page.module.css";

const MarketClient = () => {
  return (
    <ScrollArea px="4vw" py="xl" className={styles.scrollArea}>
      <Center my="xl">
        <Title order={1} size={rem(48)}>
          市场，无处不在
        </Title>
      </Center>

      <Stack gap="xl">
        <SymbolTabs
          title="指数"
          queryKey="stock-index"
          apiPath="/api/stock-index/list"
        />
        <SymbolTabs
          title="股票"
          queryKey="stock-quotes"
          apiPath="/api/stock-quotes/list"
        />
      </Stack>

      <Group gap="xl" justify="space-between" mt="xl">
        <StockRanking
          title="最高成交量股票"
          indicator="volume"
          order="desc"
          doubleColumn
        />
        <StockRanking
          title="波动最大的股票"
          indicator="amplitude"
          order="desc"
          doubleColumn
        />
      </Group>

      <Group gap="xl" justify="space-between" mt="xl">
        <StockRanking title="股票赢家" indicator="changeRate" order="desc" />
        <StockRanking title="股票输家" indicator="changeRate" order="asc" />
      </Group>
    </ScrollArea>
  );
};

export default MarketClient;
