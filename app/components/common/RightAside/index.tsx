import { useState } from "react";
import {
  IconAlarm,
  IconSettings,
  IconArticle,
  IconPalette
} from "@tabler/icons-react";
import { Box, Stack, Tooltip, UnstyledButton } from "@mantine/core";

import WatchList from "@/app/components/WatchList";
import InstrumentDetail from "@/app/components/InstrumentDetail";
import { useLoginContext } from "@/app/providers/LoginProvider";
import { useThemeSettingContext } from "@/app/providers/ThemeSettingProvider";

import styles from "./index.module.css";

const mainLinksMockdata = [
  {
    icon: <IconArticle size={28} />,
    label: "自选表、详情",
    value: "watchlist"
  },
  {
    icon: <IconAlarm size={32} />,
    label: "警告",
    value: "alarm",
    disabled: true
  },
  {
    icon: <IconPalette size={28} />,
    label: "主题设置",
    value: "theme"
  },
  {
    icon: <IconSettings size={28} />,
    label: "系统设置",
    value: "settings",
    disabled: true
  }
];

const RightAside = () => {
  const [active, setActive] = useState("watchlist");
  const { userInfo } = useLoginContext();
  const { openThemeMenu } = useThemeSettingContext();

  if (!userInfo) {
    return null;
  }

  const handleClick = (link: (typeof mainLinksMockdata)[0]) => {
    if (link.value === "theme") {
      openThemeMenu();
      return;
    }

    if (link.disabled) return;

    // TODO: hidden
    // if (link.value === active) return setActive("");

    setActive(link.value);
  };

  const mainLinks = mainLinksMockdata.map(link => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
      style={{}}
    >
      <UnstyledButton
        onClick={() => handleClick(link)}
        className={styles.mainLink}
        data-active={link.value === active || undefined}
        disabled={link.disabled}
        style={{
          width: 36,
          height: 36,
          opacity: link.disabled ? 0.5 : 1,
          cursor: link.disabled ? "default" : "pointer"
        }}
      >
        {link.icon}
      </UnstyledButton>
    </Tooltip>
  ));

  return (
    <nav className={styles.navbar}>
      <Box className={styles.wrapper}>
        <Stack gap="xs" className={styles.main}>
          <WatchList />
          <InstrumentDetail />
        </Stack>
        <Stack gap="xs" className={styles.aside}>
          {mainLinks}
        </Stack>
      </Box>
    </nav>
  );
};

export default RightAside;
