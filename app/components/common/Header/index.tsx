import {
  Avatar,
  Box,
  Button,
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
import {
  IconArrowsLeftRight,
  IconBrandGithub,
  IconBrandTelegram,
  IconLanguage,
  IconMessageCircle,
  IconMoon,
  IconUser
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useLoginContext } from "@/app/providers/LoginProvider";

import styles from "./index.module.css";

interface Link {
  link: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  target?: string;
  group?: string;
  children?: Link[];
}

const links: Link[] = [
  { link: "/explore", label: "探索", disabled: true },
  { link: "/news", label: "新闻" },
  { link: "/stock", label: "股票" },
  {
    link: "/more",
    label: "更多",
    children: [
      {
        link: "https://github.com/trade-signal",
        label: "Github",
        icon: <IconBrandGithub style={{ width: rem(14), height: rem(14) }} />,
        target: "_blank"
      },
      {
        link: "https://t.me/+25mzy3YRvbA4ODM1",
        label: "Telegram",
        icon: <IconBrandTelegram style={{ width: rem(14), height: rem(14) }} />,
        target: "_blank"
      }
    ]
  }
];

const LinkMenu = (link: Omit<Link, "children"> & { children: Link[] }) => {
  return (
    <Menu key={link.label} shadow="md" trigger="hover">
      <Menu.Target>
        <Link
          href={link.link}
          className={styles.link}
          onClick={e => e.preventDefault()}
        >
          {link.label}
        </Link>
      </Menu.Target>
      <Menu.Dropdown style={{ width: rem(200) }}>
        {link.children.map((child, index) => {
          const lastGroup = link.children[index - 1]?.group;

          return (
            <Stack key={child.label}>
              {child.group && child.group !== lastGroup && (
                <Menu.Label>{child.group}</Menu.Label>
              )}

              <Menu.Item
                h={rem(40)}
                key={child.label}
                component={Link}
                href={child.link}
                leftSection={child.icon}
                target={child.target}
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

  const { showLoginModal, isLoggedIn, userInfo } = useLoginContext();

  const items = links.map(link =>
    link.children ? (
      <LinkMenu key={link.label} {...link} children={link.children as Link[]} />
    ) : (
      <Link
        key={link.label}
        href={link.link}
        className={styles.link}
        data-active={pathname === link.link || undefined}
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
    <Group justify="space-between" className={styles.header}>
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

      <Group style={{ width: 180 }} justify="flex-end" grow>
        {isLoggedIn ? (
          <Menu shadow="md">
            <Menu.Target>
              {userInfo?.image ? (
                <Avatar
                  src={userInfo?.image || ""}
                  style={{ width: rem(32), height: rem(32), cursor: "pointer" }}
                  alt={userInfo?.name || ""}
                />
              ) : (
                <Text
                  size="sm"
                  style={{
                    cursor: "pointer",
                    textAlign: "right",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {userInfo?.name}
                </Text>
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
              size="sm"
              variant="default"
              onClick={() => showLoginModal("signin")}
            >
              登录
            </Button>
            <Button size="sm" onClick={() => showLoginModal("signup")}>
              注册
            </Button>
          </>
        )}
      </Group>
    </Group>
  );
};

export default Header;
