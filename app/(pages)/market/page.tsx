import { Metadata } from "next";
import MarketClient from "./client";

export const metadata: Metadata = {
  title: "市场行情: 实时行情数据 - TradeSignal",
  description: "提供股票、指数、板块的实时行情数据，帮助投资者及时把握市场动态"
};

export default function Market() {
  return <MarketClient />;
}
