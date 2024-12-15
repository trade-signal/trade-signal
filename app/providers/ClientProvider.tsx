"use client";

import { AppShell, Center, MantineProvider, Text } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
import { IconDeviceLaptop } from "@tabler/icons-react";

import { theme } from "../../theme";
import Header from "../components/Header";

export default function ClientProvider({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <MantineProvider theme={theme}>
        <Center h="100vh" p="md">
          <div style={{ textAlign: "center" }}>
            <IconDeviceLaptop size={48} style={{ marginBottom: 20 }} />
            <Text size="lg" c="dimmed" fw={500} mb={10}>
              暂不支持移动端访问
            </Text>
            <Text size="sm" c="dimmed">
              请使用电脑浏览器访问本网站
            </Text>
          </div>
        </Center>
      </MantineProvider>
    );
  }

  return (
    <MantineProvider theme={theme}>
      <SessionProvider session={session}>
        <Notifications />
        <AppShell header={{ height: 56 }} visibleFrom="xs">
          <Header />
          <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
      </SessionProvider>
    </MantineProvider>
  );
}
