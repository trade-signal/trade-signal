"use client";

import { useEffect, useState } from "react";
import { AppShell, Button, Center, MantineProvider, Text } from "@mantine/core";
import { SessionProvider, useSession } from "next-auth/react";
import { getServerSession, Session } from "next-auth";
import { Notifications } from "@mantine/notifications";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconDeviceLaptop } from "@tabler/icons-react";

import { theme } from "@/theme";
import Header from "@/app/components/common/Header";
import RightAside from "@/app/components/common/RightAside";
import { LoginProvider, useLogin } from "@/app/providers/LoginProvider";
import SpotlightModal from "@/app/components/modals/SpotlightModal";

function AppContent({ children }: { children: React.ReactNode }) {
  // const { isLoggedIn } = useLogin();
  // const [showRightAside, { open, close }] = useDisclosure(false);

  // useEffect(() => {
  //   isLoggedIn ? open() : close();
  // }, [isLoggedIn]);

  return (
    <AppShell
      header={{ height: 56 }}
      // aside={{
      //   width: 300,
      //   breakpoint: "sm",
      //   collapsed: { desktop: !showRightAside }
      // }}
      visibleFrom="xs"
    >
      <AppShell.Header visibleFrom="xs">
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      {/* <AppShell.Aside>{showRightAside && <RightAside />}</AppShell.Aside> */}
    </AppShell>
  );
}

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
        <LoginProvider>
          <Notifications />
          <SpotlightModal />
          <AppContent>{children}</AppContent>
        </LoginProvider>
      </SessionProvider>
    </MantineProvider>
  );
}
