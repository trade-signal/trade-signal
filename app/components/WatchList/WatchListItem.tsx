import { WatchStock } from "@/app/api/watchlist/list/route";
import { Divider, Group, Stack, Text, Button } from "@mantine/core";
import { HoverCard } from "@mantine/core";
import { StockQuotesRealTime } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { useActiveStock } from "@/app/providers/ActiveStockContent";
import {
  formatNumber,
  formatPercentPlain,
  formatYuan,
  getColor
} from "../tables/DataTable/util";

import styles from "./WatchListItem.module.css";

const InfoItem = ({
  label,
  value,
  color
}: {
  label: string;
  value: any;
  color?: string;
}) => (
  <Group>
    <Text size="xs" w={80}>
      {label}：
    </Text>
    <Text size="xs" c={color}>
      {value}
    </Text>
  </Group>
);

interface WatchListItemProps {
  stock: WatchStock;
  onRemove: (quote: StockQuotesRealTime) => void;
}

const WatchListItem = ({ stock, onRemove }: WatchListItemProps) => {
  const { activeStockCode, setActiveStockCode } = useActiveStock();
  const { quote } = stock;

  return (
    <HoverCard key={stock.code} position="left-start" offset={20}>
      <HoverCard.Target>
        <Group
          key={stock.code}
          w="100%"
          justify="space-between"
          className={styles.hoverCardItem}
          data-active={stock.code === activeStockCode}
          onClick={() => setActiveStockCode(stock.code)}
        >
          <Stack gap={2}>
            <Text fw={500} size="sm">
              {stock.code}
            </Text>
            <Text c="dimmed" size="xs">
              {stock.name}
            </Text>
          </Stack>
          <Stack gap={2} justify="flex-end">
            <Text size="sm" style={{ textAlign: "right" }}>
              {formatNumber(stock.quote.newPrice)}
            </Text>
            <Group gap="xs" align="flex-end">
              <Text size="sm" c={getColor(stock.quote.upsDowns)}>
                {formatNumber(stock.quote.upsDowns)}
              </Text>
              <Text size="sm" c={getColor(stock.quote.changeRate)}>
                {formatPercentPlain(stock.quote.changeRate)}
              </Text>
            </Group>
          </Stack>
        </Group>
      </HoverCard.Target>

      <HoverCard.Dropdown p="xs">
        <Stack gap={2}>
          <InfoItem label="代码" value={stock.code} />
          <InfoItem label="名称" value={stock.name} />
        </Stack>

        <Divider my="xs" />

        <Stack gap={2}>
          <InfoItem label="最新价" value={formatNumber(quote.newPrice)} />
          <InfoItem
            label="涨跌额"
            value={formatNumber(quote.upsDowns)}
            color={getColor(quote.upsDowns)}
          />
          <InfoItem
            label="涨跌幅"
            value={formatPercentPlain(quote.changeRate)}
            color={getColor(quote.changeRate)}
          />
          <InfoItem label="最高" value={formatNumber(quote.highPrice)} />
          <InfoItem label="最低" value={formatNumber(quote.lowPrice)} />
          <InfoItem label="今开" value={formatNumber(quote.openPrice)} />
        </Stack>

        <Divider my="xs" />

        <Stack gap={2}>
          <InfoItem label="成交量" value={formatNumber(quote.volume)} />
          <InfoItem label="成交额" value={formatYuan(quote.dealAmount)} />
          <InfoItem
            label="换手率"
            value={formatPercentPlain(quote.turnoverRate)}
          />
          <InfoItem
            label="量比"
            value={formatPercentPlain(quote.volumeRatio)}
          />
        </Stack>

        <Divider my="xs" />

        <Group justify="center">
          <Button
            variant="subtle"
            color="red"
            size="xs"
            leftSection={<IconTrash size={14} />}
            onClick={() => onRemove(stock.quote)}
          >
            移除自选
          </Button>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default WatchListItem;
