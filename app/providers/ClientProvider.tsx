"use client";

import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";

import { LoginProvider } from "@/app/providers/LoginProvider";
import SpotlightModal from "@/app/components/SpotlightModal";
import { ActiveStockProvider } from "@/app/providers/ActiveStockProvider";
import { ThemeSettingProvider } from "@/app/providers/ThemeSettingProvider";
import { SyncTaskProvider } from "@/app/providers/SyncTaskProvider";
import { useThemeSetting } from "@/app/hooks/useThemeSetting";

import AppContent from "@/app/layout/AppContent";
import AppContentMobile from "@/app/layout/AppContentMobile";

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
        <AppContentMobile />
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
                <SyncTaskProvider>
                  <Notifications />
                  <SpotlightModal />
                  <AppContent>{children}</AppContent>
                </SyncTaskProvider>
              </LoginProvider>
            </ThemeSettingProvider>
          </QueryClientProvider>
        </ActiveStockProvider>
      </SessionProvider>
    </MantineProvider>
  );
}
