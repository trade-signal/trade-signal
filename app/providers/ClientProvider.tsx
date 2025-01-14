"use client";

import { useEffect } from "react";
import { AppShell, Center, MantineProvider, rem, Text } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconDeviceLaptop } from "@tabler/icons-react";

import Header from "@/app/components/common/Header";
import RightAside from "@/app/components/common/RightAside";
import { LoginProvider } from "@/app/providers/LoginProvider";
import SpotlightModal from "@/app/components/modals/SpotlightModal";
import { ActiveStockProvider } from "@/app/providers/ActiveStockProvider";
import { ThemeSettingProvider } from "@/app/providers/ThemeSettingProvider";
import { BatchProvider } from "@/app/providers/BatchProvider";
import { useThemeSetting } from "@/app/hooks/useThemeSetting";
import { useLogin } from "@/app/hooks/useLogin";

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useLogin();
  const [collapsed, { open, close }] = useDisclosure(true);

  useEffect(() => {
    if (isLoggedIn) {
      close();
    } else {
      open();
    }
  }, [isLoggedIn]);

  const headerHeight = rem("56px");
  const asideWidth = rem("300px");

  return (
    <AppShell
      header={{ height: headerHeight }}
      aside={{
        width: collapsed ? 0 : asideWidth,
        breakpoint: "sm",
        collapsed: {
          desktop: collapsed
        }
      }}
      visibleFrom="xs"
    >
      <AppShell.Header visibleFrom="xs" pr={collapsed ? 0 : asideWidth}>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Aside top={collapsed ? headerHeight : 0} h="100%">
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

  const { colorScheme, themeLoaded } = useThemeSetting();

  if (!themeLoaded) {
    return null;
  }

  if (isMobile) {
    return (
      <MantineProvider theme={colorScheme}>
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
    <MantineProvider theme={colorScheme}>
      <SessionProvider session={session}>
        <ActiveStockProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeSettingProvider>
              <LoginProvider>
                <BatchProvider>
                  <Notifications />
                  <SpotlightModal />
                  <AppContent>{children}</AppContent>
                </BatchProvider>
              </LoginProvider>
            </ThemeSettingProvider>
          </QueryClientProvider>
        </ActiveStockProvider>
      </SessionProvider>
    </MantineProvider>
  );
}
