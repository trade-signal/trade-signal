import { Metadata } from "next";
import QuoteListClient from "./client";

export type QuoteListType = "index" | "stock" | "plate";

export const metadata: Metadata = {
  title: "市场行情: 股票、指数、板块行情 - TradeSignal"
};

interface PageProps {
  params: Promise<{ type: QuoteListType }>;
  searchParams: Promise<{ indicator?: string; order?: "asc" | "desc" }>;
}

export default async function QuoteList(props: PageProps) {
  const { type } = await props.params;
  const { indicator, order } = await props.searchParams;
  return <QuoteListClient type={type} indicator={indicator} order={order} />;
}
