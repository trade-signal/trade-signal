import { rem } from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandTelegram,
  IconProps
} from "@tabler/icons-react";

export interface RouteLink {
  link: string;
  label: string;
  value?: string;
  disabled?: boolean;
  icon?: React.ComponentType<IconProps>;
  target?: string;
  group?: string;
  children?: RouteLink[];
}

export const userRoutes = (): RouteLink[] => {
  return [
    // {
    //   link: "/products",
    //   label: "产品",
    //   children: [
    //     {
    //       link: "/products/screener",
    //       label: "选股器"
    //     },
    //     {
    //       link: "/products/treemap",
    //       label: "大盘云图"
    //     }
    //   ]
    // },
    {
      link: "/products/screener",
      label: "选股器"
    },
    {
      link: "/products/treemap",
      label: "大盘云图"
    },
    { link: "/news", label: "新闻" },
    {
      link: "/more",
      label: "更多",
      children: [
        {
          link: "https://github.com/trade-signal",
          label: "Github",
          icon: IconBrandGithub,
          target: "_blank"
        },
        {
          link: "https://t.me/+25mzy3YRvbA4ODM1",
          label: "Telegram",
          icon: IconBrandTelegram,
          target: "_blank"
        }
      ]
    }
  ];
};
