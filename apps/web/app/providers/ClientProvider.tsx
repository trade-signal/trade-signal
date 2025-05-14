"use client";

import { localStorageColorSchemeManager, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";

import SpotlightModal from "@/app/components/SpotlightModal";
import { useThemeSettingState } from "@/app/hooks/useThemeSetting";
import { THEME_COLOR_SCHEME_KEY } from "@/app/utils/theme";

import AppContent from "@/app/layout/AppContent";
import AppContentMobile from "@/app/layout/AppContentMobile";

export default function ClientProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const queryClient = new QueryClient();

  const { theme, themeLoaded } = useThemeSettingState();

  if (!themeLoaded) return null;

  const colorSchemeManager = localStorageColorSchemeManager({
    key: THEME_COLOR_SCHEME_KEY
  });

  if (isMobile) {
    return (
      <MantineProvider
        defaultColorScheme="dark"
        theme={theme}
        colorSchemeManager={colorSchemeManager}
      >
        <AppContentMobile />
      </MantineProvider>
    );
  }

  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={theme}
      colorSchemeManager={colorSchemeManager}
    >
      <QueryClientProvider client={queryClient}>
        <Notifications />
        <SpotlightModal />
        <AppContent>{children}</AppContent>
      </QueryClientProvider>
    </MantineProvider>
  );
}
