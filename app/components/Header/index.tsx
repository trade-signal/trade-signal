"use client";

import { useState } from "react";
import { Burger, Container, Group, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import styles from "./index.module.css";

const links = [
  { link: "/explore", label: "探索" },
  { link: "/signin", label: "登录" },
  { link: "/settings", label: "设置" }
];

const Header = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState();

  const items = links.map(link => (
    <a
      key={link.label}
      href={link.link}
      className={styles.link}
      data-active={active === link.link || undefined}
      onClick={event => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Container className={styles.inner}>
      <Image
        style={{ width: 28, height: 28 }}
        className={styles.logo}
        src="/icon.svg"
        alt="Chives Box logo"
      />
      <Group gap={5} visibleFrom="xs">
        {items}
      </Group>

      <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
    </Container>
  );
};

export default Header;
