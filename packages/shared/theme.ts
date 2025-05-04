"use client";

import { readLocalStorageValue } from "@mantine/hooks";
import { THEME_SETTING_KEY } from "@/apps/web/app/hooks/useThemeSetting";
import {
  createTheme,
  MantineColorScheme,
  useMantineColorScheme,
  virtualColor
} from "@mantine/core";

export interface ThemeSetting {
  colorScheme: MantineColorScheme;
  fontSize: number;
  upColor: string;
  downColor: string;
}

export const getThemeSetting = (): ThemeSetting => {
  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });
  return themeSetting;
};

export const getCurrentThemeColor = () => {
  const { colorScheme } = useMantineColorScheme();
  return colorScheme === "dark" ? "teal" : "indigo";
};

export const themeOverride = createTheme({
  primaryColor: "custom",
  colors: {
    custom: virtualColor({
      name: "custom",
      dark: "teal",
      light: "indigo"
    })
  }
});
