"use client";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";

import SpotlightModal from "@/apps/web/app/components/SpotlightModal";
import { ThemeSettingProvider } from "@/apps/web/app/providers/ThemeSettingProvider";
import { useThemeSetting } from "@/apps/web/app/hooks/useThemeSetting";

import AppContent from "@/apps/web/app/layout/AppContent";
import AppContentMobile from "@/apps/web/app/layout/AppContentMobile";

export default function ClientProvider({
  children
}: {
  children: React.ReactNode;
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
      <QueryClientProvider client={queryClient}>
        <ThemeSettingProvider>
          <Notifications />
          <SpotlightModal />
          <AppContent>{children}</AppContent>
        </ThemeSettingProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
