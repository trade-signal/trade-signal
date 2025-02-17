import { Metadata } from "next";
import QuoteListClient from "./client";

export type QuoteListType = "index" | "stock" | "plate";

export const metadata: Metadata = {
  title: "市场行情 - TradeSignal"
};

interface PageProps {
  params: Promise<{
    type: QuoteListType;
  }>;
}

export default async function QuoteList(props) {
  const { type } = await props.params;
  return <QuoteListClient type={type} />;
}
