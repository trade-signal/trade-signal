import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";

import type { Metadata, Viewport } from "next";
import { ColorSchemeScript } from "@mantine/core";

import ClientProvider from "./providers/ClientProvider";

export const metadata: Metadata = {
  title: "交易信标 | TradeSignal",
  description:
    "提供实时市场数据和分析功能，助您捕捉市场脉动，做出精准投资决策。",
  icons: {
    icon: "favicon.ico"
  },
  keywords: [
    // 产品名称
    "交易信标",
    "TradeSignal",
    "交易信号",

    // 产品功能
    "A股分析",
    "A股行情",
    "股票数据",
    "实时行情",

    // 核心功能
    "量化交易",
    "技术分析",
    "选股策略",
    "市场分析",

    // 数据特性
    "实时数据",
    "行情数据",
    "股市数据",
    "市场指标"
  ],
  authors: [{ name: "TradeSignal Team" }],
  openGraph: {
    title: "交易信标 | TradeSignal",
    description: "整合多维度市场数据，提供专业的投资分析工具",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    siteName: "交易信标 | TradeSignal",
    images: [
      {
        url: "https://tradersignal.org/favicon.ico",
        width: 32,
        height: 32,
        alt: "交易信标 | TradeSignal"
      }
    ]
  },
  robots: {
    index: true,
    follow: true
  },
  metadataBase: new URL("https://tradersignal.org")
};

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  userScalable: false
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
