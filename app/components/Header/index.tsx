"use client";

import { Burger, Container, Group, Image, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import styles from "./index.module.css";

const links = [
  { link: "/explore", label: "探索" },
  { link: "/stock", label: "股票" },
  { link: "/news", label: "新闻" },
  { link: "/settings", label: "设置" }
];

const Header = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();
  const pathname = usePathname();

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
      <Container className={styles.inner}>
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

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
};

export default Header;
