"use client";

import { useCallback } from "react";
import {
  Image,
  Box,
  Button,
  Center,
  Grid,
  Group,
  Menu,
  rem,
  Switch,
  Text,
  TextInput,
  Title,
  Select,
  Avatar,
  Stack
} from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { IconSettings } from "@tabler/icons-react";

import { RouteLink, userRoutes } from "@/app/config/routes";
import { useThemeSetting } from "@/app/hooks/useThemeSetting";

import styles from "./index.module.css";

const LinkMenu = (
  link: Omit<RouteLink, "children"> & { children: RouteLink[] }
) => {
  const pathname = usePathname();

  return (
    <Menu
      key={link.label}
      shadow="md"
      trigger="hover"
      withArrow
      position="bottom-start"
    >
      <Menu.Target>
        <Link
          href={link.link}
          className={styles.link}
          data-active={pathname.includes(link.link) ? "true" : undefined}
          onClick={e => e.preventDefault()}
        >
          {link.label}
        </Link>
      </Menu.Target>
      <Menu.Dropdown style={{ minWidth: rem(160), zIndex: 1000 }}>
        {link.children.map((child, index) => {
          const lastGroup = link.children[index - 1]?.group;

          return (
            <Stack key={child.label} gap={0}>
              {child.group && child.group !== lastGroup && (
                <Menu.Label mb={0}>{child.group}</Menu.Label>
              )}

              <Menu.Item
                h={rem(40)}
                key={child.label}
                component={Link}
                href={child.link}
                style={{
                  pointerEvents: child.disabled ? "none" : "auto",
                  color: child.disabled ? "gray" : ""
                }}
                onClick={e => {
                  if (child.disabled) {
                    e.preventDefault();
                    return;
                  }
                }}
                leftSection={child.icon ? <child.icon /> : undefined}
                target={child.target}
                disabled={child.disabled}
              >
                {child.label}
              </Menu.Item>
            </Stack>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = userRoutes();

  const { setThemeSetting, colorScheme } = useThemeSetting();

  const isActive = useCallback(
    (link: RouteLink) => {
      const active =
        (link.link !== "/" && pathname.includes(link.link)) ||
        pathname === link.link;

      return active;
    },
    [pathname]
  );

  const items = routes.map(link =>
    link.children ? (
      <LinkMenu
        key={link.label}
        {...link}
        children={link.children as RouteLink[]}
      />
    ) : (
      <Link
        key={link.label}
        href={link.link}
        className={styles.link}
        data-active={isActive(link)}
        style={{
          pointerEvents: link.disabled ? "none" : "auto",
          color: link.disabled ? "gray" : ""
        }}
      >
        {link.label}
      </Link>
    )
  );

  return (
    <Grid className={styles.header}>
      <Grid.Col
        span={4}
        className={styles.headerItem}
        style={{ cursor: "pointer" }}
      >
        <Group gap="lg">
          <Group
            gap="xs"
            mr={16}
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
          >
            <Image
              style={{ width: rem(24), height: rem(24) }}
              src={"/logo.svg"}
              alt="TradeSignal logo"
            />
            <Title order={3} visibleFrom="xl">
              <Text fw="bolder" size="xl" inherit>
                TradeSignal
              </Text>
            </Title>
          </Group>

          {items}
        </Group>
      </Grid.Col>

      <Grid.Col span={4} className={styles.headerItem}>
        <Center>
          <Box onClick={spotlight.open} style={{ cursor: "pointer" }}>
            <TextInput
              size="xs"
              w={300}
              radius="xl"
              variant="filled"
              placeholder="搜索股票/基金/债券"
              mr={10}
              style={{ pointerEvents: "none" }}
            />
          </Box>
        </Center>
      </Grid.Col>

      <Grid.Col span={4} className={styles.headerItem}>
        <Group h="100%" align="center" justify="space-between">
          <Group flex={1} justify="flex-end" mr={rem(60)}>
            <Menu offset={20} withArrow={false} shadow="md">
              <Menu.Target>
                <Box className={styles.settings}>
                  <IconSettings className={styles.icon} />
                </Box>
              </Menu.Target>

              <Menu.Dropdown style={{ width: rem(200) }}>
                {/* <Menu.Item key="bot">
                  <Text size="xs">Telegram Bot</Text>
                </Menu.Item> */}
                <Menu.Item key="language" closeMenuOnClick={false}>
                  <Group justify="space-between">
                    <Text size="xs">语言</Text>
                    <Select
                      size="xs"
                      w={100}
                      disabled
                      defaultValue={"zh"}
                      variant="filled"
                      withCheckIcon={false}
                      data={[
                        { label: "简体中文", value: "zh" },
                        { label: "English", value: "en" }
                      ]}
                    />
                  </Group>
                </Menu.Item>
                <Menu.Item key="theme" closeMenuOnClick={false}>
                  <Group justify="space-between">
                    <Text size="xs">深色模式</Text>
                    <Switch
                      checked={colorScheme === "dark"}
                      onChange={() =>
                        setThemeSetting(
                          colorScheme === "dark" ? "light" : "dark"
                        )
                      }
                      size="xs"
                    />
                  </Group>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Grid.Col>
    </Grid>
  );
};

export default Header;
