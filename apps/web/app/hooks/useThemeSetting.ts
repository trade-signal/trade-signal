"use client";

import { DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import {
  themeOverride,
  ThemeSetting,
  getThemeSetting
} from "@/app/utils/theme";

export type SetThemeType = "colorScheme" | "fontSize" | "upColor" | "downColor";

export const DEFAULT_THEME_SETTING: ThemeSetting = {
  colorScheme: "light",
  fontSize: 16,
  upColor: "#ec4040",
  downColor: "#2e8b57"
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
      defaultValue = getThemeSetting();

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
