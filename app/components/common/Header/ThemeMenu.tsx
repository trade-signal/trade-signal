import {
  DEFAULT_THEME,
  ActionIcon,
  Drawer,
  Group,
  Radio,
  useMantineColorScheme,
  Divider,
  MantineColorScheme,
  Box,
  ColorInput
} from "@mantine/core";
import { useState, useEffect } from "react";
import { readLocalStorageValue } from "@mantine/hooks";
import { SetTheme, THEME_SETTING_KEY } from "@/app/hooks/useThemeSetting";

export const ThemeMenu = ({
  setTheme,
  visible,
  onClose
}: {
  setTheme: SetTheme;
  visible: boolean;
  onClose: () => void;
}) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });

  // initialize
  useEffect(() => {
    if (themeSetting?.colorScheme) {
      setColorScheme(themeSetting?.colorScheme);
    }

    if (themeSetting?.theme) {
      setTheme("theme", themeSetting.theme);
    }

    if (themeSetting?.fontSize) {
      setTheme("fontSize", themeSetting.fontSize);
    }

    if (themeSetting?.upColor) {
      setTheme("upColor", themeSetting.upColor);
    }

    if (themeSetting?.downColor) {
      setTheme("downColor", themeSetting.downColor);
    }
  }, []);

  return (
    <Drawer
      position="left"
      opened={visible}
      onClose={onClose}
      title="主题设置"
      size="sm"
    >
      <Box>
        <Divider my="md" labelPosition="left" label="模式" />
        <Radio.Group
          value={colorScheme}
          onChange={value => {
            setColorScheme(value as MantineColorScheme);
            setTheme("colorScheme", value as MantineColorScheme);
          }}
        >
          <Group>
            <Radio value="light" label="亮色" />
            <Radio value="dark" label="暗色" />
            <Radio value="auto" label="跟随系统" />
          </Group>
        </Radio.Group>
      </Box>

      <Box>
        <Divider my="md" labelPosition="left" label="自定义" />
        <ColorInput
          value={themeSetting.upColor}
          format="hex"
          description="上涨"
          placeholder="请选择颜色"
          swatches={Object.values(DEFAULT_THEME.colors).map(color => color[7])}
          onChange={value => setTheme("upColor", value)}
        />
        <ColorInput
          mt="md"
          value={themeSetting.downColor}
          format="hex"
          description="下跌"
          placeholder="请选择颜色"
          swatches={Object.values(DEFAULT_THEME.colors).map(color => color[7])}
          onChange={value => setTheme("downColor", value)}
        />
      </Box>
    </Drawer>
  );
};
