import { Container } from "@mantine/core";
import { Metadata } from "next";

import { StockProvider } from "./StockContext";
import StockScreener from "./StockScreener";
import StockList from "./StockList";

export const metadata: Metadata = {
  title: "股票筛选器: 搜索和过滤股票"
};

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
