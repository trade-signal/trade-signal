import { DEFAULT_THEME, MantineColorScheme, MantineTheme, mergeMantineTheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { themeOverride } from "@/theme";

export type SetThemeType = 'theme' | 'colorScheme' | 'fontSize';
export type SetThemeValue<T extends SetThemeType> = T extends 'theme'
  ? Partial<MantineTheme> & { primaryColor: string }
  : T extends 'colorScheme'
    ? MantineColorScheme
    : T extends 'fontSize'
      ? string | number
      : never;

export type SetTheme = (type: SetThemeType, value: SetThemeValue<SetThemeType>) => void;

export const DEFAULT_THEME_SETTING: Record<SetThemeType, any> = {
  theme: {
    primaryColor: "custom",
  },
  colorScheme: "light",
  fontSize: 16,
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

  const _setTheme: SetTheme = (type, value) => {
    if (type === 'theme') {
      setTheme(mergeMantineTheme(theme, value as Partial<MantineTheme>));
    } else if (type === 'fontSize') {
      document.documentElement.style.fontSize = `${value}px`;
    }
    setThemeSetting({
      ...themeSetting,
      [type]: value,
    });
  };

  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  useEffect(() => {
    setIsThemeLoaded(true);
    try {
      defaultValue = JSON.parse(localStorage.getItem(THEME_SETTING_KEY) || '{}');
      if (!defaultValue.theme) {
        defaultValue.theme = DEFAULT_THEME_SETTING.theme;
      }
      if (!defaultValue.colorScheme) {
        defaultValue.colorScheme = DEFAULT_THEME_SETTING.colorScheme;
      }
    } catch {
      defaultValue = DEFAULT_THEME_SETTING;
    }

    setThemeSetting(defaultValue);
  }, []);

  return {
    theme,
    setTheme: _setTheme,
    isThemeLoaded,
  }
}