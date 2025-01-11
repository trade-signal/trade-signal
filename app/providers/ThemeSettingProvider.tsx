import { createContext, ReactNode, useContext } from "react";
import { useDisclosure } from "@mantine/hooks";

import { useThemeSetting } from "@/app/hooks/useThemeSetting";
import { ThemeMenu } from "@/app/components/common/ThemeMenu";

interface ThemeSettingContextType {
  visible: boolean;
  openThemeMenu: () => void;
  closeThemeMenu: () => void;
}

const ThemeSettingContext = createContext<ThemeSettingContextType | undefined>(
  undefined
);

export const ThemeSettingProvider = ({ children }: { children: ReactNode }) => {
  const { setTheme } = useThemeSetting();
  const [visible, { open, close }] = useDisclosure();

  return (
    <ThemeSettingContext.Provider
      value={{ visible, openThemeMenu: open, closeThemeMenu: close }}
    >
      {children}

      <ThemeMenu setTheme={setTheme} visible={visible} onClose={close} />
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
