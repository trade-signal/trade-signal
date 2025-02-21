import { useEffect } from "react";
import { AppShell, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Header from "@/app/layout/Header";
import RightAside from "@/app/layout/RightAside";
import { useLogin } from "@/app/hooks/useLogin";

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useLogin();
  const [collapsed, { open, close }] = useDisclosure(true);

  useEffect(() => {
    if (isLoggedIn) {
      close();
    } else {
      open();
    }
  }, [isLoggedIn]);

  const headerHeight = rem("56px");
  const asideWidth = rem("300px");

  return (
    <AppShell
      header={{ height: headerHeight }}
      aside={{
        width: collapsed ? 0 : asideWidth,
        breakpoint: "sm",
        collapsed: {
          desktop: collapsed
        }
      }}
      visibleFrom="xs"
    >
      <AppShell.Header visibleFrom="xs" pr={collapsed ? 0 : asideWidth}>
        {/* <Header /> */}
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Aside top={collapsed ? headerHeight : 0} h="100%">
        <RightAside />
      </AppShell.Aside>
    </AppShell>
  );
}

export default AppContent;
