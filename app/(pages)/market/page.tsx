import { Metadata } from "next";
import MarketClient from "./client";

export const metadata: Metadata = {
  title: "市场行情: 股票、指数、板块行情 - TradeSignal"
};

export default function Market() {
  return <MarketClient />;
}
