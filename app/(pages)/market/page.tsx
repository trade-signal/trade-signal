import { Center, Container, rem, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import StockIndex from "./StockIndex";

export const metadata: Metadata = {
  title: "市场行情：实时股票和指数行情 - TradeSignal"
};

const Market = () => {
  return (
    <Container fluid px="3vw" pt="xl">
      <Center mt="xl">
        <Title order={1} size={rem(48)}>
          市场，无处不在
        </Title>
      </Center>

      <Stack gap="xl" mt="xl">
        <StockIndex />
      </Stack>
    </Container>
  );
};

export default Market;
