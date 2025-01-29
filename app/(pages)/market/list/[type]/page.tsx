import { Metadata } from "next";
import MarketListClient from "./client";

export const metadata: Metadata = {
  title: "市场行情：实时股票和指数行情 - TradeSignal"
};

export default async function MarketList(props) {
  const { type } = await props.params;
  return <MarketListClient type={type} />;
}
