import { Metadata } from "next";
import MarketClient from "./client";

export const metadata: Metadata = {
  title: "市场行情：实时股票和指数行情 - TradeSignal"
};

export default function Market(props) {
  return <MarketClient />;
}
