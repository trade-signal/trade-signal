import {
  Center,
  Container,
  rem,
  ScrollArea,
  Stack,
  Title
} from "@mantine/core";
import { Metadata } from "next";
import StockIndex from "./StockIndex";
import StockQuotes from "./StockQuotes";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "市场行情：实时股票和指数行情 - TradeSignal"
};

const Market = () => {
  return (
    <ScrollArea
      px="4vw"
      py="xl"
      className={classes.scrollArea}
    >
      <Center my="xl">
        <Title order={1} size={rem(48)}>
          市场，无处不在
        </Title>
      </Center>

      <Stack gap="xl">
        <StockIndex />
        <StockQuotes />
      </Stack>
    </ScrollArea>
  );
};

export default Market;
