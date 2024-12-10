"use client";

import { createTheme, virtualColor } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "custom",
  colors: {
    custom: virtualColor({
      name: "custom",
      dark: "cyan",
      light: "gray"
    })
  }
});
