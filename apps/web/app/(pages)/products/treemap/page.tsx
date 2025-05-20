import { Container } from "@mantine/core";
import { Metadata } from "next";

import TreemapChartClient from "./client";

export const metadata: Metadata = {
  title: "大盘云图 | 板块热力图 - TradeSignal",
  description: "可视化展现市场板块涨跌分布，快速识别热点板块"
};

const MarketMapPage = () => {
  return (
    <Container fluid h={"calc(100vh - 80px)"}>
      <TreemapChartClient />
    </Container>
  );
};

export default MarketMapPage;
