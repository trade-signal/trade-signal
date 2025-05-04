import { HoverCard, Text } from "@mantine/core";
import { ColumnAlign } from "@/apps/web/app/types/column.type";
import { getThemeSetting } from "./theme";
import { getColor, formatPercent, getUpDownColor } from "./formatters";
import { formatDateDiff } from "./date";

export const renderUpNumber = (value: number, decimals = 2) => {
  return (
    <Text span c={getUpDownColor("up", value)} fw={700}>
      {value}
    </Text>
  );
};

export const renderDownNumber = (value: number, decimals = 2) => {
  return (
    <Text span c={getUpDownColor("down", value)} fw={700}>
      {value}
    </Text>
  );
};

export const renderNumber = (value: number, decimals = 2) => {
  const val = value.toFixed(decimals);
  return (
    <Text span c={getColor(Number(val))} fw={700}>
      {val}
    </Text>
  );
};

export const renderPercent = (value: number, decimals = 2) => {
  const val = formatPercent(value, decimals, false);
  return (
    <Text span c={getColor(Number(val))} fw={700}>
      {val}%
    </Text>
  );
};

export const renderSignal = (value: boolean) => {
  const themeSetting = getThemeSetting();
  if (value) {
    return (
      <Text span c={themeSetting.upColor} fw={700}>
        ✓
      </Text>
    );
  }
  return (
    <Text span c={themeSetting.downColor} fw={700}>
      ✗
    </Text>
  );
};

export const renderTimeWithHover = (value: string) => {
  const { relativeTime, date } = formatDateDiff(value);

  return (
    <HoverCard position="top">
      <HoverCard.Target>
        <Text size="sm">{relativeTime}</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="xs" c="gray.7" fw={500}>
          {date}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export const generateRowKey = (
  index: number,
  orderBy?: string,
  order?: string
) => `row-${index}-${orderBy || ""}-${order || ""}`;

export const transformAlign = (align?: ColumnAlign) => {
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  if (align === "center") return "center";
  return "flex-start";
};
