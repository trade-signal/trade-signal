"use client";

import { createTheme, virtualColor } from "@mantine/core";

export const themeOverride = createTheme({
  primaryColor: "custom",
  colors: {
    custom: virtualColor({
      name: "custom",
      dark: "cyan",
      light: "indigo"
    })
  }
});
