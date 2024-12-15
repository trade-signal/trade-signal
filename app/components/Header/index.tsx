"use client";

import {
  Avatar,
  Box,
  Button,
  Group,
  Image,
  Menu,
  rem,
  Text,
  TextInput,
  AppShell,
  Title
} from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import {
  IconArrowsLeftRight,
  IconLanguage,
  IconMessageCircle,
  IconMoon,
  IconUser
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useLoginContext } from "@/app/providers/LoginProvider";
import SpotlightModal from "../SpotlightModal";

import styles from "./index.module.css";

const links = [
  { link: "/explore", label: "探索" },
  { link: "/stock", label: "股票" },
  { link: "/news", label: "新闻" },
  { link: "/contact", label: "联系我们" }
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { showLoginModal, isLoggedIn, userInfo } = useLoginContext();

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
    <AppShell.Header className={styles.header} visibleFrom="xs">
      <Group justify="space-between" className={styles.inner}>
        <Group
          gap={5}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <Image
            style={{ width: rem(32), height: rem(32) }}
            src="/icon.svg"
            alt="TradeSignal logo"
          />
          <Title order={3} visibleFrom="xl">
            <Text fw={700} size="xl" inherit>
              TradeSignal
            </Text>
          </Title>
        </Group>

        <Group gap={5}>
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
            <Menu shadow="md">
              <Menu.Target>
                {userInfo?.image ? (
                  <Avatar
                    src={userInfo?.image || ""}
                    size={rem(32)}
                    alt={userInfo?.name || ""}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <Text style={{ cursor: "pointer" }}>{userInfo?.name}</Text>
                )}
              </Menu.Target>

              <Menu.Dropdown style={{ width: rem(200) }}>
                <Menu.Item
                  disabled
                  leftSection={
                    <IconUser style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  个人资料
                </Menu.Item>

                <Menu.Item
                  disabled
                  leftSection={
                    <IconMessageCircle
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  最新消息
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  disabled
                  leftSection={
                    <IconMoon style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={() => signOut()}
                >
                  暗色模式
                </Menu.Item>

                <Menu.Item
                  disabled
                  leftSection={
                    <IconLanguage style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  语言
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  leftSection={
                    <IconArrowsLeftRight
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={() => signOut()}
                >
                  退出登录
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <>
              <Button
                variant="default"
                onClick={() => showLoginModal("signin")}
              >
                登录
              </Button>
              <Button onClick={() => showLoginModal("signup")}>注册</Button>
            </>
          )}
        </Group>
      </Group>

      <SpotlightModal />
    </AppShell.Header>
  );
};

export default Header;
