"use client";

import { Center, Group, rem, ScrollArea, Stack, Title } from "@mantine/core";

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
          apiBasePath="/api/stock-index"
          showMore={false}
          moreText="查看所有指数"
          moreLink="/market/list/index"
        />
        <SymbolTabs
          title="股票"
          queryKey="stock-quotes"
          apiBasePath="/api/stock-quotes"
          showMore={false}
          moreText="查看所有股票"
          moreLink="/market/list/stock"
        />
      </Stack>

      <Group gap="xl" justify="space-between" mt="xl" pt="xl">
        <StockRanking
          title="最高成交量股票"
          indicator="volume"
          order="desc"
          doubleColumn
          showMore={false}
          moreText="查看交易最活跃的所有股票"
          moreLink="/market/list/stock"
        />
        <StockRanking
          title="波动最大的股票"
          indicator="amplitude"
          order="desc"
          doubleColumn
          showMore={false}
          moreText="查看波动最大的所有股票"
          moreLink="/market/list/stock"
        />
      </Group>

      <Group gap="xl" justify="space-between" mt="xl" pt="xl">
        <StockRanking
          title="股票赢家"
          indicator="changeRate"
          order="desc"
          showMore={false}
          moreText="查看每日涨幅最大的所有股票"
          moreLink="/market/list/stock"
        />
        <StockRanking
          title="股票输家"
          indicator="changeRate"
          order="asc"
          showMore={false}
          moreText="查看每日跌幅最大的所有股票"
          moreLink="/market/list/stock"
        />
      </Group>
    </ScrollArea>
  );
};

export default MarketClient;
