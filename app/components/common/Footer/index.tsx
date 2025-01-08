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

import classes from "./index.module.css";

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

const FooterLinks = () => {
  const groups = data.map(group => {
    const links = group.links.map((link, index) => (
      <Text<"a">
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={event => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Group gap={5}>
            <Image
              style={{ width: rem(26), height: rem(26) }}
              src="/icon.svg"
              alt="TradeSignal logo"
            />
            <Title order={3} visibleFrom="xl">
              <Text fw="bolder" size="xs" inherit>
                TradeSignal
              </Text>
            </Title>
          </Group>
          <Text size="sm" c="dimmed" className={classes.description}>
            整合多维度市场数据，提供专业的投资分析工具。
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2025 TradeSignal. All rights reserved.
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <Link
              target="_blank"
              className={classes.socialLink}
              href="https://github.com/trade-signal"
            >
              <IconBrandGithub size={18} stroke={1.5} />
            </Link>
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <Link
              target="_blank"
              className={classes.socialLink}
              href="https://t.me/+25mzy3YRvbA4ODM1"
            >
              <IconBrandTelegram size={18} stroke={1.5} />
            </Link>
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <Link
              target="_blank"
              className={classes.socialLink}
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

export default FooterLinks;
