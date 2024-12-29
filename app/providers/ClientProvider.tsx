"use client";

import { useEffect } from "react";
import { AppShell, Center, MantineProvider, Text } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconDeviceLaptop } from "@tabler/icons-react";

import { theme } from "@/theme";
import Header from "@/app/components/common/Header";
import RightAside from "@/app/components/common/RightAside";
import { LoginProvider, useLogin } from "@/app/providers/LoginProvider";
import SpotlightModal from "@/app/components/modals/SpotlightModal";
import { ActiveStockProvider } from "@/app/providers/ActiveStockContent";

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useLogin();
  const [collapsed, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (isLoggedIn) {
      close();
    } else {
      open();
    }
  }, [isLoggedIn]);

  return (
    <AppShell
      header={{ height: 56 }}
      aside={{
        width: collapsed ? 0 : 300,
        breakpoint: "sm",
        collapsed: {
          desktop: collapsed
        }
      }}
      visibleFrom="xs"
    >
      <AppShell.Header visibleFrom="xs" pr={collapsed ? 0 : 300}>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Aside top={collapsed ? 56 : 0} h="100%">
        <RightAside />
      </AppShell.Aside>
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
  const queryClient = new QueryClient();

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
        <ActiveStockProvider>
          <QueryClientProvider client={queryClient}>
            <LoginProvider>
              <Notifications />
              <SpotlightModal />
              <AppContent>{children}</AppContent>
            </LoginProvider>
          </QueryClientProvider>
        </ActiveStockProvider>
      </SessionProvider>
    </MantineProvider>
  );
}
