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
import { useThemeSetting } from "@/app/hooks/useThemeSetting";
import { useEffect } from "react";

export const ThemeMenu = ({
  visible,
  onClose
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { themeSetting, setThemeSetting } = useThemeSetting();

  const { colorScheme, setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (colorScheme === themeSetting.colorScheme) return;
    setColorScheme(themeSetting.colorScheme);
  }, [themeSetting.colorScheme]);

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
          value={themeSetting.colorScheme}
          onChange={value => {
            setThemeSetting("colorScheme", value as MantineColorScheme);
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
          onChange={value => setThemeSetting("upColor", value)}
        />
        <ColorInput
          mt="md"
          value={themeSetting.downColor}
          format="hex"
          description="下跌"
          placeholder="请选择颜色"
          swatches={Object.values(DEFAULT_THEME.colors).map(color => color[7])}
          onChange={value => setThemeSetting("downColor", value)}
        />
      </Box>
    </Drawer>
  );
};
