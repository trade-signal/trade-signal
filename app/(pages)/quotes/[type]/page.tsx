import { Metadata } from "next";
import QuoteListClient from "./client";

export type QuoteListType = "index" | "stock" | "plate";

export const metadata: Metadata = {
  title: "市场行情: 实时行情数据 - TradeSignal",
  description: "提供股票、指数、板块的实时行情数据，帮助投资者及时把握市场动态"
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
