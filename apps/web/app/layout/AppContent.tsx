import { AppShell, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Header from "./Header";
import Footer from "./Footer";

function AppContent({ children }: { children: React.ReactNode }) {
  const [collapsed, { open, close }] = useDisclosure(true);

  const headerHeight = rem("48px");
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
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}

export default AppContent;
