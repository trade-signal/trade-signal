import { useState } from "react";
import {
  IconAlarm,
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconSettings,
  IconArticle,
  IconUser
} from "@tabler/icons-react";
import { Box, Stack, Title, Tooltip, UnstyledButton } from "@mantine/core";
import classes from "./index.module.css";

const mainLinksMockdata = [
  { icon: IconArticle, label: "自选表、详情", value: "table" },
  { icon: IconAlarm, label: "警告", value: "alarm", disabled: true },
  { icon: IconSettings, label: "设置", value: "settings", disabled: true }
];

const RightAside = () => {
  const [active, setActive] = useState("");

  const mainLinks = mainLinksMockdata.map(link => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => {
          if (link.disabled) return;
          if (link.value === active) return setActive("");
          setActive(link.value);
        }}
        className={classes.mainLink}
        data-active={link.value === active || undefined}
        disabled={link.disabled}
        style={{
          opacity: link.disabled ? 0.5 : 1
        }}
      >
        <link.icon size={24} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  return (
    <nav className={classes.navbar}>
      <Box className={classes.wrapper}>
        <Stack className={classes.main}>Todo</Stack>
        <Stack gap="xs" className={classes.aside}>
          {mainLinks}
        </Stack>
      </Box>
    </nav>
  );
};

export default RightAside;
