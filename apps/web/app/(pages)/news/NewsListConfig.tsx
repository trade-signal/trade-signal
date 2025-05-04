import { News } from "@prisma/client";
import Link from "next/link";
import { HoverCard, Pill, ScrollArea, Text } from "@mantine/core";
import { Column } from "@/apps/web/app/types/column.type";
import { renderTimeWithHover } from "@/packages/shared/renders";

// 定时来源类型
enum SourceType {
  SINA = "sina",
  CLS = "cls"
}

// 定义市场类型枚举
enum NewsMarketType {
  CN = "cn", // A股
  US = "us", // 美股
  HK = "hk", // 港股
  FUND = "fund", // 基金
  CFF = "cff", // 期货
  FOREX = "foreign", // 外汇
  WORLD_INDEX = "worldIndex", // 全球指数
  COMMODITY = "commodity", // 大宗商品
  GLOBAL = "global", // 全球
  GLOBAL_BOND = "globalbd" // 全球债券
}

// 来源映射
export const SOURCE_MAP: Record<string, string> = {
  [SourceType.SINA]: "新浪财经",
  [SourceType.CLS]: "财联社"
};

// 颜色映射
export const MARKET_COLORS: Record<string, string> = {
  [NewsMarketType.CN]: "red",
  [NewsMarketType.US]: "blue",
  [NewsMarketType.HK]: "green",
  [NewsMarketType.FUND]: "violet",
  [NewsMarketType.CFF]: "orange",
  [NewsMarketType.FOREX]: "cyan",
  [NewsMarketType.WORLD_INDEX]: "indigo",
  [NewsMarketType.COMMODITY]: "yellow",
  [NewsMarketType.GLOBAL]: "teal",
  [NewsMarketType.GLOBAL_BOND]: "lime"
};

// 市场标签映射
export const MARKET_LABELS: Record<string, string> = {
  [NewsMarketType.CN]: "A股",
  [NewsMarketType.US]: "美股",
  [NewsMarketType.HK]: "港股",
  [NewsMarketType.FUND]: "基金",
  [NewsMarketType.CFF]: "期货",
  [NewsMarketType.FOREX]: "外汇",
  [NewsMarketType.WORLD_INDEX]: "全球指数",
  [NewsMarketType.COMMODITY]: "大宗商品",
  [NewsMarketType.GLOBAL]: "全球",
  [NewsMarketType.GLOBAL_BOND]: "全球债券"
};

const getMarketColor = (market: string): string => {
  return MARKET_COLORS[market.toLowerCase()] || "gray";
};

const getMarketLabel = (market: string): string => {
  return MARKET_LABELS[market.toLowerCase()] || market;
};

interface Stock {
  market: string; // cn 国内，us 美股, hk 港股, fund 基金
  code: string;
  name: string;
}

const generateRowKey = (row: News, stock: Stock) =>
  `${row.id}-${stock.code}-${stock.market}-${stock.name}`;

const formatStocks = (stocks: Stock[], row: News) => {
  if (!stocks || stocks.length === 0) return "--";

  try {
    return (
      <ScrollArea.Autosize mah={120} maw={240} mx="auto" offsetScrollbars>
        {stocks.map(stock => {
          const market = row.source === SourceType.SINA ? stock.market : "cn";

          const isCn =
            market === NewsMarketType.CN &&
            ["sz", "sh"].some(key => stock.code.startsWith(key));

          const marketLabel = getMarketLabel(market);
          const marketColor = getMarketColor(market);

          return (
            <HoverCard key={generateRowKey(row, stock)} position="top">
              <HoverCard.Target>
                <Pill
                  size="sm"
                  c={marketColor}
                  style={{
                    margin: "0 4px 4px 0"
                  }}
                >
                  {`${marketLabel} · ${stock.code}`}
                </Pill>
              </HoverCard.Target>
              <HoverCard.Dropdown p="xs">
                <Text size="xs">市场：{marketLabel}</Text>
                {isCn ? (
                  <Text size="xs">
                    代码：
                    <Link href={`/stock?symbol=${stock.code}`} target="_blank">
                      {stock.code}
                    </Link>
                  </Text>
                ) : (
                  <Text size="xs">代码：{stock.code}</Text>
                )}
                <Text size="xs">名称：{stock.name}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          );
        })}
      </ScrollArea.Autosize>
    );
  } catch (error) {
    return "--";
  }
};

export const COLUMNS: Column<News>[] = [
  {
    key: "date",
    title: "发布时间",
    width: 140,
    align: "left",
    render: renderTimeWithHover
  },
  {
    key: "stocks",
    title: "关联市场",
    width: 260,
    align: "left",
    render: formatStocks
  },
  {
    key: "content",
    title: "内容",
    align: "left"
  },
  {
    key: "source",
    title: "来源",
    align: "center",
    width: 200,
    render: source => SOURCE_MAP[source] || source
  }
];
