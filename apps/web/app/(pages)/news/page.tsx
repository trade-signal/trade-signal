import { Container } from "@mantine/core";
import { Metadata } from "next";

import { NewsProvider } from "./NewsContext";
import NewsScreener from "./NewsScreener";
import NewsList from "./NewsList";

export const metadata: Metadata = {
  title: "新闻流: 定制市场新闻 - TradeSignal",
  description: "实时市场新闻筛选与追踪，助您把握投资先机"
};

const News = () => {
  return (
    <NewsProvider>
      <Container fluid>
        <NewsScreener />
        <NewsList />
      </Container>
    </NewsProvider>
  );
};

export default News;
