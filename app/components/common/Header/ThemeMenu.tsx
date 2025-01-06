import {
  DEFAULT_THEME,
  ActionIcon,
  Drawer,
  Group,
  Radio,
  useMantineColorScheme,
  Divider,
  Input,
  MantineColorScheme,
  CheckIcon,
  ColorSwatch,
  useMantineTheme
} from "@mantine/core";
import { useState, useEffect } from "react";
import { ColorWheelIcon } from "./ColorWheelIcon";
import classes from "./ThemeMenu.module.css";
import { readLocalStorageValue } from "@mantine/hooks";
import { SetTheme, THEME_SETTING_KEY } from "@/app/hooks/useThemeSetting";

export const ThemeMenu = ({ setTheme }: { setTheme: SetTheme }) => {
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);

  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });
  useEffect(() => {
    if (themeSetting?.colorScheme) {
      setColorScheme(themeSetting?.colorScheme);
    }

    if (themeSetting?.primaryColor) {
      setTheme({ primaryColor: themeSetting.primaryColor });
    }
  }, [])

  return (
    <>
      <ActionIcon
        size="lg"
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
        <Radio.Group
          label="模式"
          value={colorScheme}
          onChange={value => {
            setColorScheme(value as MantineColorScheme);
            setTheme(undefined, value as MantineColorScheme);
          }}
        >
          <Group>
            <Radio value="light" label="亮色" />
            <Radio value="dark" label="暗色" />
            <Radio value="auto" label="跟随系统" />
          </Group>
        </Radio.Group>

        <Divider my="md" />

        <Input.Wrapper label="主题色">
        <Group>
          {
            Object.keys(DEFAULT_THEME.colors)
            .filter((color) => color !== 'dark')
            .map(color => (
              <ColorSwatch
              color={`var(--mantine-color-${color}-filled)`}
              component="button"
              key={color}
              onClick={() => setTheme({ primaryColor: color })}
              radius="sm"
              className={classes.swatch}
              aria-label={color}
            >
              {theme.primaryColor === color && <CheckIcon className={classes.check} />}
            </ColorSwatch>
            ))
          }
          </Group>
        </Input.Wrapper>
      </Drawer>
    </>
  );
};