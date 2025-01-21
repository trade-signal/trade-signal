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
import { Metadata } from "next";

import StockRanking from "./components/StockRanking";
import StockIndex from "./StockIndex";
import StockQuotes from "./StockQuotes";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "市场行情：实时股票和指数行情 - TradeSignal"
};

const Market = props => {
  return (
    <ScrollArea px="4vw" py="xl" className={styles.scrollArea}>
      <Center my="xl">
        <Title order={1} size={rem(48)}>
          市场，无处不在
        </Title>
      </Center>

      <Stack gap="xl">
        <StockIndex />
        <StockQuotes />
      </Stack>

      <Group gap="xl" justify="space-between" mt="xl">
        <StockRanking title="最高成交量股票" indicator="volume" order="desc" />
        <StockRanking
          title="波动最大的股票"
          indicator="amplitude"
          order="desc"
        />
      </Group>

      {/* 股票涨跌榜单 */}
      <Group gap="xl" justify="space-between" mt="xl">
        <StockRanking title="股票赢家" indicator="changeRate" order="desc" />
        <StockRanking title="股票输家" indicator="changeRate" order="asc" />
      </Group>
    </ScrollArea>
  );
};

export default Market;
