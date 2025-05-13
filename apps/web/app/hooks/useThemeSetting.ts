"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_THEME,
  mergeMantineTheme,
  useMantineColorScheme
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import {
  type ThemeSetting,
  themeOverride,
  getThemeSetting,
  THEME_SETTING_KEY,
  DEFAULT_THEME_SETTING,
  type ThemeSettingKey
} from "@/app/utils/theme";

export const useThemeSettingState = () => {
  const [themeSetting, setThemeSetting] = useLocalStorage<ThemeSetting>({
    key: THEME_SETTING_KEY,
    defaultValue: DEFAULT_THEME_SETTING,
    serialize: value => JSON.stringify(value),
    deserialize: value => JSON.parse(value || "{}")
  });

  const theme = useMemo(() => {
    return mergeMantineTheme(DEFAULT_THEME, themeOverride);
  }, [themeSetting.colorScheme]);

  const [themeLoaded, setThemeLoaded] = useState(false);

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
    theme,
    themeSetting,
    themeLoaded,
    setThemeSetting
  };
};

export const useThemeSetting = () => {
  const { setColorScheme } = useMantineColorScheme();
  const { themeSetting, setThemeSetting, theme, themeLoaded } =
    useThemeSettingState();

  const _setThemeSetting = (
    value: any,
    type: ThemeSettingKey = "colorScheme"
  ) => {
    switch (type) {
      case "fontSize":
        document.documentElement.style.fontSize = `${value}px`;
        break;
      case "upColor":
      case "downColor":
        document.documentElement.style.setProperty(`--${type}`, `${value}`);
        break;
      case "colorScheme":
        setColorScheme(value);
        break;
      default:
        break;
    }

    setThemeSetting({
      ...themeSetting,
      [type]: value
    });
  };

  const colorScheme = useMemo(() => {
    return themeSetting.colorScheme;
  }, [themeSetting.colorScheme]);

  return {
    theme,
    colorScheme,
    themeSetting,
    themeLoaded,
    setThemeSetting: _setThemeSetting
  };
};
