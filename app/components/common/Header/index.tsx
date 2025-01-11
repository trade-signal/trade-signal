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
  Title,
  useMantineColorScheme
} from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import {
  IconArrowsLeftRight,
  IconBrandGithub,
  IconBrandTelegram,
  IconLanguage,
  IconMessageCircle,
  IconPalette,
  IconUser
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useLoginContext } from "@/app/providers/LoginProvider";
import { useThemeSettingContext } from "@/app/providers/ThemeSettingProvider";

import styles from "./index.module.css";
import { useMemo } from "react";

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
  { link: "/market", label: "市场" },
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
            <Stack key={child.label} gap={0}>
              {child.group && child.group !== lastGroup && (
                <Menu.Label mb={0}>{child.group}</Menu.Label>
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

  const { colorScheme } = useMantineColorScheme();
  const isDark = useMemo(() => colorScheme === "dark", [colorScheme]);

  const { openThemeMenu } = useThemeSettingContext();

  const [logo, userIcon] = useMemo(
    () => [
      isDark ? "/icon-dark.svg" : "/icon.svg",
      isDark ? "/icon-user-dark.svg" : "/icon-user.svg"
    ],
    [isDark]
  );

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

      <Group justify="flex-end">
        <Menu shadow="md">
          {isLoggedIn ? (
            <>
              <Menu.Target>
                {userInfo?.image ? (
                  <Box className={styles.avatarWrapper}>
                    <Avatar
                      src={userInfo?.image || ""}
                      size={rem(32)}
                      alt={userInfo?.name || ""}
                    />
                  </Box>
                ) : (
                  <Text size="sm" className={styles.username}>
                    {userInfo?.name}
                  </Text>
                )}
              </Menu.Target>

              <Menu.Dropdown style={{ width: rem(200) }}>
                <Menu.Item
                  key="profile"
                  disabled
                  leftSection={
                    <IconUser style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  个人资料
                </Menu.Item>

                <Menu.Item
                  key="message"
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

                {commonMenuItems}

                <Menu.Divider />

                <Menu.Item
                  key="logout"
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
            </>
          ) : (
            <>
              <Menu.Target>
                <Box className={styles.avatarWrapper}>
                  <Image
                    src={userIcon}
                    alt="user"
                    style={{ width: rem(24), height: rem(24) }}
                  />
                </Box>
              </Menu.Target>

              <Menu.Dropdown style={{ width: rem(200) }}>
                <Menu.Item
                  key="login"
                  leftSection={
                    <IconUser style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={() => showLoginModal("signin")}
                >
                  登录
                </Menu.Item>

                <Menu.Divider />

                {commonMenuItems}
              </Menu.Dropdown>
            </>
          )}
        </Menu>
      </Group>
    </Group>
  );
};

export default Header;
