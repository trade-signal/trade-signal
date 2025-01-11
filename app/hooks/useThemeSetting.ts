"use client";

import { themeOverride } from "@/theme";
import {
  DEFAULT_THEME,
  MantineColorScheme,
  mergeMantineTheme
} from "@mantine/core";
import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";

export type SetThemeType = "colorScheme" | "fontSize" | "upColor" | "downColor";

export interface ThemeSetting {
  colorScheme: MantineColorScheme;
  fontSize: number;
  upColor: string;
  downColor: string;
}

export const DEFAULT_THEME_SETTING: ThemeSetting = {
  colorScheme: "light",
  fontSize: 16,
  upColor: "#f03e3e",
  downColor: "#37b24d"
};

export const THEME_SETTING_KEY = "trade-signal-theme-setting";

export const useThemeSetting = () => {
  const [themeSetting, setThemeSetting] = useLocalStorage<ThemeSetting>({
    key: THEME_SETTING_KEY,
    defaultValue: DEFAULT_THEME_SETTING,
    serialize: value => JSON.stringify(value),
    deserialize: value => JSON.parse(value || "{}")
  });

  const colorScheme = useMemo(() => {
    return mergeMantineTheme(DEFAULT_THEME, themeOverride);
  }, [themeSetting.colorScheme]);

  const [themeLoaded, setThemeLoaded] = useState(false);

  const _setThemeSetting = (type: SetThemeType, value: any) => {
    switch (type) {
      case "fontSize":
        document.documentElement.style.fontSize = `${value}px`;
        break;
      case "upColor":
      case "downColor":
        document.documentElement.style.setProperty(`--${type}`, `${value}`);
        break;
    }

    setThemeSetting({
      ...themeSetting,
      [type]: value
    });
  };

  useEffect(() => {
    let defaultValue = DEFAULT_THEME_SETTING;

    try {
      defaultValue = readLocalStorageValue({
        key: THEME_SETTING_KEY
      }) as ThemeSetting;

      if (!defaultValue.colorScheme) {
        defaultValue.colorScheme = DEFAULT_THEME_SETTING.colorScheme;
      }
    } catch {
      defaultValue = DEFAULT_THEME_SETTING;
    }

    setThemeSetting(defaultValue);
    setThemeLoaded(true);
  }, []);

  return {
    colorScheme,
    themeSetting,
    themeLoaded,
    setThemeSetting: _setThemeSetting
  };
};
