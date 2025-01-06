import { DEFAULT_THEME, MantineColorScheme, MantineTheme, mergeMantineTheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { themeOverride } from "@/theme";

export type SetTheme = (newTheme?: Partial<MantineTheme>, newColorScheme?: MantineColorScheme) => void;

export const DEFAULT_THEME_SETTING = {
  primaryColor: "custom",
  colorScheme: "light"
}

export const THEME_SETTING_KEY = "trade-signal-theme-setting";
export const useThemeSetting = () => {
  let defaultValue = DEFAULT_THEME_SETTING;

  const [themeSetting, setThemeSetting] = useLocalStorage({
    key: THEME_SETTING_KEY,
    defaultValue,
    serialize: (value) => JSON.stringify(value),
    deserialize: (value) => JSON.parse(value || '{}'),
  });

  const [theme, setTheme] = useState(mergeMantineTheme(DEFAULT_THEME, themeOverride));

  const _setTheme: SetTheme = (newTheme, newColorScheme) => {
    if (newTheme) { 
      setTheme(mergeMantineTheme(DEFAULT_THEME, newTheme));
    }
    setThemeSetting({
      primaryColor: newTheme?.primaryColor || themeSetting.primaryColor,
      colorScheme: newColorScheme || themeSetting.colorScheme,
    });
  };

  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  useEffect(() => {
    setIsThemeLoaded(true);
    try {
      defaultValue = JSON.parse(localStorage.getItem(THEME_SETTING_KEY) || '{}');
      if (!defaultValue.primaryColor) {
        defaultValue.primaryColor = DEFAULT_THEME_SETTING.primaryColor;
      }
      if (!defaultValue.colorScheme) {
        defaultValue.colorScheme = DEFAULT_THEME_SETTING.colorScheme;
      }
    } catch {
      defaultValue = DEFAULT_THEME_SETTING;
    }
  }, []);

  return {
    theme,
    setTheme: _setTheme,
    isThemeLoaded,
  }
}