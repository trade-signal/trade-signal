import {
  DEFAULT_THEME,
  Drawer,
  Group,
  Radio,
  Divider,
  MantineColorScheme,
  Box,
  ColorInput,
  useMantineColorScheme
} from "@mantine/core";
import { SetThemeType, useThemeSetting } from "@/app/hooks/useThemeSetting";
import { useEffect, useState } from "react";
import { type ColorArray, hex2rgbArray, isTextReadable, rgbArray2hex } from "@/shared/color";

export const ThemeMenu = ({
  visible,
  onClose
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { themeSetting, setThemeSetting } = useThemeSetting();

  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const _setTheme = (type: SetThemeType, value: any) => {
    setThemeSetting(type, value);
  };

  useEffect(() => {
    if (colorScheme === themeSetting.colorScheme) return;
    setColorScheme(themeSetting.colorScheme);
  }, [themeSetting.colorScheme]);

  const [colorTips, setColorTips] = useState<{
    upColor?: string;
    downColor?: string;
  }>({
    upColor: undefined,
    downColor: undefined
  });
  useEffect(() => {
    const scheme = themeSetting.colorScheme === 'auto' ? window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light' : themeSetting.colorScheme;
    const bgColor: ColorArray = scheme === 'dark' ? [0, 0, 0] : [255, 255, 255];

    // 检测字体颜色是否清晰
    setColorTips({
      upColor: isTextReadable(bgColor, hex2rgbArray(themeSetting.upColor), 3) ? undefined : '当前颜色对比度过低，建议调整',
      downColor: isTextReadable(bgColor, hex2rgbArray(themeSetting.downColor), 3) ? undefined : '当前颜色对比度过低，建议调整'
    })
  }, [themeSetting.upColor, themeSetting.downColor, themeSetting.colorScheme])

  return (
    <Drawer
      position="right"
      opened={visible}
      onClose={onClose}
      title="主题设置"
      size="sm"
    >
      <Box>
        <Divider my="md" labelPosition="left" label="模式" />
        <Radio.Group
          value={themeSetting.colorScheme}
          onChange={value => _setTheme("colorScheme", value as MantineColorScheme)}
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
          error={colorTips.upColor}
          swatches={Object.values(DEFAULT_THEME.colors).map(color => color[7])}
          onChange={value => _setTheme("upColor", value)}
        />
        <ColorInput
          mt="md"
          value={themeSetting.downColor}
          format="hex"
          description="下跌"
          placeholder="请选择颜色"
          error={colorTips.downColor}
          swatches={Object.values(DEFAULT_THEME.colors).map(color => color[7])}
          onChange={value => _setTheme("downColor", value)}
        />
      </Box>
    </Drawer>
  );
};
