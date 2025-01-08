import dayjs from "dayjs";
import { HoverCard, Text } from "@mantine/core";
import { ColumnAlign } from "./types";
import { readLocalStorageValue } from "@mantine/hooks";
import { THEME_SETTING_KEY } from "@/app/hooks/useThemeSetting";

export const transformAlign = (align?: ColumnAlign) => {
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  if (align === "center") return "center";
  return "flex-start";
};

export const generateRowKey = (
  index: number,
  orderBy?: string,
  order?: string
) => `row-${index}-${orderBy || ""}-${order || ""}`;

export const getColor = (value: number) => {
  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });
  if (value > 0) return themeSetting.upColor ?? "red.7";
  if (value < 0) return themeSetting.downColor ?? "green.7";
  return "gray.7";
};

export const formatPercent = (value: number, decimals = 2) => {
  const val = value.toFixed(decimals);
  return (
    <Text span c={getColor(Number(val))} fw={700}>
      {val}%
    </Text>
  );
};
export const formatPercentPlain = (value: number) => value.toFixed(2) + "%";

export const formatNumber = (value: number, decimals = 2) =>
  value.toFixed(decimals);

export const formatBillion = (value: number) => (value / 100000000).toFixed(2);

export const renderSignal = (value: boolean) => {
  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });
  if (value) {
    return (
      <Text span c={themeSetting.upColor ?? "green.7"} fw={700}>
        ✓
      </Text>
    );
  }
  return (
    <Text span c={themeSetting.downColor ?? "red.7"} fw={700}>
      ✗
    </Text>
  );
};

export const formatLargeNumber = (value: number) => {
  if (!value && value !== 0) return "-";

  const units = [
    { value: 1e8, unit: "亿" },
    { value: 1e4, unit: "万" },
    { value: 1, unit: "" }
  ];

  for (const { value: unitValue, unit } of units) {
    if (Math.abs(value) >= unitValue) {
      const formatted = (value / unitValue).toFixed(2);
      // 去除末尾的 .00
      const display = formatted.replace(/\.00$/, "");
      return `${display}${unit}`;
    }
  }

  return "0";
};
export const formatVolume = formatLargeNumber;
export const formatYuan = formatLargeNumber;

export const formatDate = (value: string) => dayjs(value).format("YYYY-MM-DD");
export const formatDateE = (value: string) =>
  dayjs(value).format("YYYY-MM-DD HH:mm:ss");

export const formatDateDiff = (value: string) => {
  const now = dayjs();
  const date = dayjs(value);
  const diffMinutes = now.diff(date, "minutes");
  const diffHours = now.diff(date, "hours");
  const diffDays = now.diff(date, "days");

  let relativeTime = "";
  if (diffDays > 0) {
    relativeTime = `${diffDays}天前`;
  } else if (diffHours > 0) {
    relativeTime = `${diffHours}小时前`;
  } else if (diffMinutes > 0) {
    relativeTime = `${diffMinutes}分钟前`;
  } else {
    relativeTime = "刚刚";
  }

  return (
    <HoverCard position="top">
      <HoverCard.Target>
        <Text size="sm">{relativeTime}</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="xs" c="gray.7" fw={500}>
          {formatDateE(value)}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
