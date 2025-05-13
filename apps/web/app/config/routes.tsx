import { rem } from "@mantine/core";
import { IconBrandGithub, IconBrandTelegram } from "@tabler/icons-react";

export interface RouteLink {
  link: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  target?: string;
  group?: string;
  children?: RouteLink[];
}

const links: RouteLink[] = [
  {
    link: "/products",
    label: "产品",
    children: [
      {
        link: "/products/screener",
        label: "选股器"
      },
      {
        link: "/products/treemap",
        label: "大盘云图"
      }
    ]
  },
  { link: "/news", label: "新闻" },
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

export default links;
