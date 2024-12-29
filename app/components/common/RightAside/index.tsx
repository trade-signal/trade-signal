import { useState } from "react";
import { IconAlarm, IconSettings, IconArticle } from "@tabler/icons-react";
import { Box, SimpleGrid, Stack, Tooltip, UnstyledButton } from "@mantine/core";

import WatchList from "@/app/components/WatchList";
import InstrumentDetail from "@/app/components/InstrumentDetail";

import classes from "./index.module.css";

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
    icon: <IconSettings size={28} />,
    label: "设置",
    value: "settings",
    disabled: true
  }
];

const RightAside = () => {
  const [active, setActive] = useState("watchlist");

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
        onClick={() => {
          if (link.disabled) return;
          // TODO: hidden
          // if (link.value === active) return setActive("");
          setActive(link.value);
        }}
        className={classes.mainLink}
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
    <nav className={classes.navbar}>
      <Box className={classes.wrapper}>
        <Stack gap="xs" className={classes.main}>
          <WatchList />
          <InstrumentDetail />
        </Stack>
        <Stack gap="xs" className={classes.aside}>
          {mainLinks}
        </Stack>
      </Box>
    </nav>
  );
};

export default RightAside;
