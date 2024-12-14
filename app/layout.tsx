import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/notifications/styles.css";

import type { Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";
import { Session } from "next-auth";
import ClientProvider from "./providers/ClientProvider";

export const metadata: Metadata = {
  title: "交易信标 | TradeSignal",
  description:
    "提供实时市场数据和分析功能，助您捕捉市场脉动，做出精准投资决策。",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session: Session;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ClientProvider session={session}>{children}</ClientProvider>
      </body>
    </html>
  );
}
