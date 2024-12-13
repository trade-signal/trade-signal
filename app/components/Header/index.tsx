"use client";

import { useState } from "react";

import { Box, Button, Group, Image, rem, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { spotlight } from "@mantine/spotlight";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

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
    <header className={styles.header}>
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
    </header>
  );
};

export default Header;
