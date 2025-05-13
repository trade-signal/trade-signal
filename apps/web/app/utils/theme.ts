import { readLocalStorageValue } from "@mantine/hooks";
import {
  type MantineColorScheme,
  type MantineThemeOverride,
  createTheme,
  useMantineColorScheme,
  virtualColor
} from "@mantine/core";

export interface ThemeSetting {
  colorScheme: MantineColorScheme;
  fontSize: number;
  upColor: string;
  downColor: string;
}

export type ThemeSettingKey =
  | "colorScheme"
  | "fontSize"
  | "upColor"
  | "downColor";

export const THEME_COLOR_SCHEME_KEY = "trade-signal-theme-color-scheme";
export const THEME_SETTING_KEY = "trade-signal-theme-setting";

export const DEFAULT_THEME_SETTING: ThemeSetting = {
  colorScheme: "dark",
  fontSize: 16,
  upColor: "#ec4040",
  downColor: "#2e8b57"
};

export const getThemeSetting = (): ThemeSetting => {
  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });
  return themeSetting ?? DEFAULT_THEME_SETTING;
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
}) as MantineThemeOverride;
