import {
  Box,
  Group,
  Image,
  Menu,
  rem,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import { IconLanguage, IconPalette } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useThemeSettingContext } from "@/app/providers/ThemeSettingProvider";
import { useThemeIcon } from "@/app/hooks/useThemeIcon";
import links, { type RouteLink } from "@/app/config/routes";

import styles from "./index.module.css";

const LinkMenu = (
  link: Omit<RouteLink, "children"> & { children: RouteLink[] }
) => {
  const pathname = usePathname();

  return (
    <Menu key={link.label} shadow="md" trigger="hover">
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
      <Menu.Dropdown style={{ width: rem(200) }}>
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
                leftSection={child.icon}
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

  const { openThemeMenu } = useThemeSettingContext();
  const { logo, userIcon } = useThemeIcon();

  const items = links.map(link =>
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
        data-active={pathname.includes(link.link) ? "true" : undefined}
        style={{
          pointerEvents: link.disabled ? "none" : "auto",
          color: link.disabled ? "gray" : ""
        }}
        onClick={e => {
          // hack: handle /quotes redirect
          if (link.link.startsWith("/quotes") && !link.link.endsWith("/")) {
            e.preventDefault();
            router.push(link.link + "/index");
          }
        }}
      >
        {link.label}
      </Link>
    )
  );

  const commonMenuItems = [
    <Menu.Item
      key="theme"
      leftSection={<IconPalette style={{ width: rem(14), height: rem(14) }} />}
      onClick={openThemeMenu}
    >
      主题设置
    </Menu.Item>,
    <Menu.Item
      key="language"
      disabled
      leftSection={<IconLanguage style={{ width: rem(14), height: rem(14) }} />}
    >
      切换语言
    </Menu.Item>
  ];

  return (
    <Group justify="space-between" align="center" className={styles.header}>
      <Group
        gap={5}
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        <Image
          style={{ width: rem(32), height: rem(32) }}
          src={logo}
          alt="TradeSignal logo"
        />
        <Title order={3} visibleFrom="xl">
          <Text fw="bolder" size="xl" inherit>
            TradeSignal
          </Text>
        </Title>
      </Group>

      <Group gap={5} align="center">
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

      <Group justify="flex-end"></Group>
    </Group>
  );
};

export default Header;
