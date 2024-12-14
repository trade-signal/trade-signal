"use client";

import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

import { theme } from "../../theme";
import Header from "../components/Header";

export default function ClientProvider({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <MantineProvider theme={theme}>
      <SessionProvider session={session}>
        <Header />
        <main>{children}</main>
      </SessionProvider>
    </MantineProvider>
  );
}
