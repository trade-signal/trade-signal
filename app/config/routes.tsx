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
        label: "股票筛选器"
      },
      {
        link: "/products/market-map",
        label: "大盘云图"
      }
    ]
  },
  { link: "/market", label: "市场" },
  { link: "/news", label: "新闻" },
  {
    link: "/quotes",
    label: "行情中心"
  },
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
