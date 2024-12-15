"use client";

import { useState } from "react";

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
  AppShell
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
import { signOut, useSession } from "next-auth/react";
import AuthorizationModal, { AuthType } from "../AuthorizationModal";
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
  const { data: session } = useSession();

  const [authType, setAuthType] = useState<AuthType>("signin");
  const [visible, { open, close }] = useDisclosure(false);

  const handleAuthType = (type: AuthType) => {
    setAuthType(type);
    open();
  };

  const isLoggedIn = !!session;

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
        <Group style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <Image
            style={{ width: rem(30), height: rem(30) }}
            className={styles.logo}
            src="/icon.svg"
            alt="TradeSignal logo"
          />
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
                {session?.user?.image ? (
                  <Avatar
                    src={session?.user?.image || ""}
                    size={rem(32)}
                    alt={session?.user?.name || ""}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <Text>{session?.user?.name}</Text>
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
                onClick={() => handleAuthType("signin")}
              >
                登录
              </Button>
              <Button onClick={() => handleAuthType("signup")}>注册</Button>
            </>
          )}
        </Group>
      </Group>

      <SpotlightModal />

      <AuthorizationModal type={authType} visible={visible} onClose={close} />
    </AppShell.Header>
  );
};

export default Header;
