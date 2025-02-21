"use client";

import { readLocalStorageValue } from "@mantine/hooks";
import { THEME_SETTING_KEY } from "@/app/hooks/useThemeSetting";
import { createTheme, MantineColorScheme, virtualColor } from "@mantine/core";

export interface ThemeSetting {
  colorScheme: MantineColorScheme;
  fontSize: number;
  upColor: string;
  downColor: string;
}

export const generateRangeColors = (
  startColor: string,
  endColor: string,
  steps: number
) => {
  const start = startColor.match(/\w\w/g)?.map(hex => parseInt(hex, 16)) || [];
  const end = endColor.match(/\w\w/g)?.map(hex => parseInt(hex, 16)) || [];

  return Array.from({ length: steps }, (_, i) => {
    const r = Math.round(start[0] + (end[0] - start[0]) * (i / (steps - 1)));
    const g = Math.round(start[1] + (end[1] - start[1]) * (i / (steps - 1)));
    const b = Math.round(start[2] + (end[2] - start[2]) * (i / (steps - 1)));
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  });
};

export const getThemeSetting = (): ThemeSetting => {
  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });
  return themeSetting;
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
