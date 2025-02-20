import { createContext, ReactNode, useContext } from "react";
import { useDisclosure } from "@mantine/hooks";

import { ThemeMenu } from "@/app/layout/ThemeMenu";

interface ThemeSettingContextType {
  visible: boolean;
  openThemeMenu: () => void;
  closeThemeMenu: () => void;
}

const ThemeSettingContext = createContext<ThemeSettingContextType | undefined>(
  undefined
);

export const ThemeSettingProvider = ({ children }: { children: ReactNode }) => {
  const [visible, { open, close }] = useDisclosure();

  return (
    <ThemeSettingContext.Provider
      value={{ visible, openThemeMenu: open, closeThemeMenu: close }}
    >
      {children}

      <ThemeMenu visible={visible} onClose={close} />
    </ThemeSettingContext.Provider>
  );
};

export function useThemeSettingContext() {
  const context = useContext(ThemeSettingContext);
  if (context === undefined) {
    throw new Error(
      "useThemeSettingContext must be used within a ThemeSettingProvider"
    );
  }
  return context;
}
