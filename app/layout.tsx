import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";

import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

import { theme } from "../theme";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "交易信标 | TradeSignal",
  description:
    "提供实时市场数据和分析功能，助您捕捉市场脉动，做出精准投资决策。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Header />
          <main>{children}</main>
        </MantineProvider>
      </body>
    </html>
  );
}
