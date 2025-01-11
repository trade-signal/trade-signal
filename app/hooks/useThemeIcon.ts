import { useMantineColorScheme } from "@mantine/core";
import { useMemo } from "react";

export const useThemeIcon = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = useMemo(() => colorScheme === "dark", [colorScheme]);

  const [logo, userIcon] = useMemo(
    () => [
      isDark ? "/icon-dark.svg" : "/icon.svg",
      isDark ? "/icon-user-dark.svg" : "/icon-user.svg"
    ],
    [isDark]
  );

  return { logo, userIcon };
};
