"use client";

import { Burger, Button, Group, Image, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./index.module.css";
import { IconUser } from "@tabler/icons-react";

const links = [
  { link: "/explore", label: "探索" },
  { link: "/stock", label: "股票" },
  { link: "/news", label: "新闻" },
  { link: "/contact", label: "联系我们" }
];

const Header = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();

  const isLoggedIn = true;

  const items = links.map(link => (
    <Link key={link.label} href={link.link} className={styles.link}>
      {link.label}
    </Link>
  ));

  return (
    <header className={styles.header}>
      <Group className={styles.inner}>
        <Group style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <Image
            style={{ width: 28, height: 28 }}
            className={styles.logo}
            src="/icon.svg"
            alt="TradeSignal logo"
          />
          <Text fw={700} fz="lg">
            TradeSignal
          </Text>
        </Group>

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Group justify="center" grow>
          {isLoggedIn ? (
            <IconUser size={22} />
          ) : (
            <>
              <Button variant="default">登录</Button>
              <Button>注册</Button>
            </>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Group>
    </header>
  );
};

export default Header;
