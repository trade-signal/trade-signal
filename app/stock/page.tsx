import { Box, Container, Group, SimpleGrid, Stack, Title } from "@mantine/core";

import { StockProvider } from "./StockContext";
import StockScreener from "./StockScreener";
import StockList from "./StockList";

const Stock = () => {
  return (
    <StockProvider>
      <Container fluid>
        <StockScreener />
        <StockList />
      </Container>
    </StockProvider>
  );
};

export default Stock;
