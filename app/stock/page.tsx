import { Container } from "@mantine/core";

import { StockProvider } from "./StockContext";
import StockScreener from "./StockScreener";
import StockList from "./StockList";

const Stock = () => {
  return (
    <StockProvider>
      <Container>
        <StockScreener />
        <StockList />
      </Container>
    </StockProvider>
  );
};

export default Stock;