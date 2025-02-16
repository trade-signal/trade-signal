import { Metadata } from "next";
import QuoteListClient from "./client";

export type QuoteListType = "indices" | "stocks" | "sectors";

export const metadata: Metadata = {
  title: "市场行情：实时股票和指数行情 - TradeSignal"
};

interface PageProps {
  params: Promise<{
    type: QuoteListType;
  }>;
}

export default async function QuoteList(props: PageProps) {
  const { type } = await props.params;
  return <QuoteListClient type={type} />;
}
