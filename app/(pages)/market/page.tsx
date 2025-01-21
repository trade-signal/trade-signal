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

import StockChangeRate from "./components/StockChangeRate";
import StockIndex from "./StockIndex";
import StockQuotes from "./StockQuotes";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "市场行情：实时股票和指数行情 - TradeSignal"
};

const Market = () => {
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
        <StockChangeRate mode="up" />
        <StockChangeRate mode="down" />
      </Group>
    </ScrollArea>
  );
};

export default Market;
