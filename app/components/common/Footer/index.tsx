import dayjs from "dayjs";
import {
  IconBrandGithub,
  IconBrandTelegram,
  IconBrandTwitter
} from "@tabler/icons-react";
import {
  ActionIcon,
  Container,
  Group,
  Image,
  rem,
  Text,
  Title
} from "@mantine/core";
import Link from "next/link";
import { useThemeIcon } from "@/app/hooks/useThemeIcon";

import styles from "./index.module.css";

const data = [
  {
    title: "关于我们",
    links: [
      { label: "隐私条款", link: "/privacy/privacy.html" },
      { label: "GitHub 组织", link: "https://github.com/trade-signal" }
    ]
  },
  {
    title: "社交媒体",
    links: [
      { label: "Telegram 群组", link: "https://t.me/+25mzy3YRvbA4ODM1" },
      { label: "Twitter 官方", link: "https://x.com/yangzhi40338736" }
    ]
  }
];

const Footer = () => {
  const { logo } = useThemeIcon();

  const groups = data.map(group => {
    const links = group.links.map((link, index) => (
      <Text<"a">
        key={index}
        className={styles.link}
        component="a"
        href={link.link}
        target="_blank"
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={styles.wrapper} key={group.title}>
        <Text className={styles.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.logo}>
          <Group gap={5}>
            <Image
              style={{ width: rem(24), height: rem(24) }}
              src={logo}
              alt="TradeSignal logo"
            />
            <Title order={3} visibleFrom="xl">
              <Text fw="bolder" size="xs" inherit>
                TradeSignal
              </Text>
            </Title>
          </Group>
          <Text size="xs" c="dimmed" className={styles.description}>
            整合多维度市场数据，提供专业的投资分析工具。
          </Text>
        </div>
        <div className={styles.groups}>{groups}</div>
      </Container>
      <Container className={styles.afterFooter}>
        <Text c="dimmed" size="xs">
          © {dayjs().year()} TradeSignal • AGPL v3.0
        </Text>

        <Group
          gap={0}
          className={styles.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <Link
              target="_blank"
              className={styles.socialLink}
              href="https://github.com/trade-signal"
            >
              <IconBrandGithub size={18} stroke={1.5} />
            </Link>
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <Link
              target="_blank"
              className={styles.socialLink}
              href="https://t.me/+25mzy3YRvbA4ODM1"
            >
              <IconBrandTelegram size={18} stroke={1.5} />
            </Link>
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <Link
              target="_blank"
              className={styles.socialLink}
              href="https://x.com/yangzhi40338736"
            >
              <IconBrandTwitter size={18} stroke={1.5} />
            </Link>
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
};

export default Footer;
