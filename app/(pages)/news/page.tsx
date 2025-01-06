import { Container } from "@mantine/core";
import { Metadata } from "next";

import { NewsProvider } from "./NewsContext";
import NewsScreener from "./NewsScreener";
import NewsList from "./NewsList";

export const metadata: Metadata = {
  title: "新闻流：定制市场新闻 - TradeSignal"
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
