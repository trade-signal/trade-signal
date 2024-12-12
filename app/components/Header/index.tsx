"use client";

import {
  Box,
  Burger,
  Button,
  Group,
  Image,
  rem,
  Text,
  TextInput
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import styles from "./index.module.css";
import {
  IconDashboard,
  IconFileText,
  IconHome,
  IconSearch,
  IconUser
} from "@tabler/icons-react";
import { spotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";

const links = [
  { link: "/explore", label: "探索" },
  { link: "/stock", label: "股票" },
  { link: "/news", label: "新闻" },
  { link: "/contact", label: "联系我们" }
];

const actions: SpotlightActionData[] = [
  {
    id: "stock",
    label: "股票",
    description: "跳转至股票页面",
    onClick: () => console.log("Home"),
    leftSection: (
      <IconHome style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    )
  },
  {
    id: "news",
    label: "新闻",
    description: "跳转至新闻页面",
    onClick: () => console.log("Dashboard"),
    leftSection: (
      <IconDashboard style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    )
  },
  {
    id: "contact",
    label: "联系我们",
    description: "访问文档以了解更多功能",
    onClick: () => console.log("Documentation"),
    leftSection: (
      <IconFileText style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    )
  }
];

const Header = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/sign") {
    return null;
  }

  const isLoggedIn = false;

  const items = links.map(link => (
    <Link
      key={link.label}
      href={link.link}
      className={styles.link}
      data-active={pathname === link.link || undefined}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={styles.header}>
      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "搜素..."
        }}
      />

      <Group className={styles.inner}>
        <Group style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <Image
            style={{ width: rem(30), height: rem(30) }}
            className={styles.logo}
            src="/icon.svg"
            alt="TradeSignal logo"
          />
        </Group>

        <Group gap={5} visibleFrom="xs">
          <Box onClick={spotlight.open} style={{ cursor: "pointer" }}>
            <TextInput
              radius="xl"
              variant="filled"
              placeholder="搜索（Ctrl+K）"
              mr={10}
              style={{ pointerEvents: "none" }}
            />
          </Box>
          {items}
        </Group>

        <Group justify="center" grow>
          {isLoggedIn ? (
            <IconUser size={rem(22)} />
          ) : (
            <>
              <Button
                variant="default"
                onClick={() => router.push("/sign?type=login")}
              >
                登录
              </Button>
              <Button onClick={() => router.push("/sign?type=register")}>
                注册
              </Button>
            </>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Group>
    </header>
  );
};

export default Header;
