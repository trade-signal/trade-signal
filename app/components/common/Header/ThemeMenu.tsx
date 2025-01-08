import {
  DEFAULT_THEME,
  ActionIcon,
  Drawer,
  Group,
  Radio,
  useMantineColorScheme,
  Divider,
  MantineColorScheme,
  CheckIcon,
  ColorSwatch,
  useMantineTheme,
  NumberInput,
  Box,
  ColorInput
} from "@mantine/core";
import { useState, useEffect } from "react";
import { ColorWheelIcon } from "./ColorWheelIcon";
import classes from "./ThemeMenu.module.css";
import { readLocalStorageValue, useDebouncedCallback, useDebouncedState } from "@mantine/hooks";
import { SetTheme, THEME_SETTING_KEY } from "@/app/hooks/useThemeSetting";

export const ThemeMenu = ({ setTheme }: { setTheme: SetTheme }) => {
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);

  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });
  // initialize
  useEffect(() => {
    if (themeSetting?.colorScheme) {
      setColorScheme(themeSetting?.colorScheme);
    }

    if (themeSetting?.theme) {
      setTheme('theme', themeSetting.theme);
    }

    if (themeSetting?.fontSize) {
      setTheme('fontSize', themeSetting.fontSize);
    }

    if (themeSetting?.upColor) {
      setTheme('upColor', themeSetting.upColor);
    }

    if (themeSetting?.downColor) {
      setTheme('downColor', themeSetting.downColor);
    }
  }, [])

  const [fontSize, setFontSize] = useState<string | number>(themeSetting.fontSize);
  const setThemeFontSize = useDebouncedCallback((value: string | number) => {
    setTheme('fontSize', value);
  }, 300);
  const handleFontSizeChange = (value: string | number) => {
    setFontSize(value);
    setThemeFontSize(value);
  }

  console.log(DEFAULT_THEME.colors)

  return (
    <>
      <ActionIcon
        size={36}
        variant="default"
        aria-label="Settings"
        onClick={() => setOpened(true)}
      >
        <ColorWheelIcon />
      </ActionIcon>
      <Drawer
        position="right"
        opened={opened}
        onClose={() => setOpened(false)}
        title="主题设置"
        size="sm"
      >
        <Box>
          <Divider my="md" labelPosition="left" label="模式" />
          <Radio.Group
            value={colorScheme}
            onChange={value => {
              setColorScheme(value as MantineColorScheme);
              setTheme('colorScheme', value as MantineColorScheme);
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
          <Divider my="md" labelPosition="left" label="主题色" />
          <Group gap={16}>
            {
              Object.keys(DEFAULT_THEME.colors)
              .filter((color) => color !== 'dark')
              .map(color => (
                <ColorSwatch
                  color={`var(--mantine-color-${color}-filled)`}
                  component="button"
                  key={color}
                  onClick={() => setTheme('theme', { primaryColor: color })}
                  radius="sm"
                  size={32}
                  className={classes.swatch}
                  aria-label={color}
                >
                {theme.primaryColor === color && <CheckIcon className={classes.check} />}
              </ColorSwatch>
              ))
            }
          </Group>
        </Box>

        <Box>
          <Divider my="md" labelPosition="left" label="字号" />
          <NumberInput
            value={fontSize}
            min={12}
            max={24}
            suffix="px"
            allowDecimal={false}
            onChange={handleFontSizeChange}
          />
        </Box>

        <Box>
          <Divider my="md" labelPosition="left" label="自定义" />
          <ColorInput
            value={themeSetting.upColor}
            format="hex"
            description="上涨"
            placeholder="请选择颜色"
            swatches={Object.values(DEFAULT_THEME.colors).map(color => color[7])}
            onChange={value => setTheme('upColor', value)}
          />
          <ColorInput
            mt="md"
            value={themeSetting.downColor}
            format="hex"
            description="下跌"
            placeholder="请选择颜色"
            swatches={Object.values(DEFAULT_THEME.colors).map(color => color[7])}
            onChange={value => setTheme('downColor', value)}
          />
        </Box>
      </Drawer>
    </>
  );
};