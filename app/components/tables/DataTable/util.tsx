import dayjs from "dayjs";
import { Text } from "@mantine/core";
import { ColumnAlign } from "./types";

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

const getColor = (value: number) => {
  if (value > 0) return "red.7";
  if (value < 0) return "green.7";
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
export const formatNumber = (value: number, decimals = 2) =>
  value.toFixed(decimals);
export const formatBillion = (value: number) => (value / 100000000).toFixed(2);
export const renderSignal = (value: boolean) => {
  if (value) {
    return (
      <Text span c="green.7" fw={700}>
        ✓
      </Text>
    );
  }
  return (
    <Text span c="red.7" fw={700}>
      ✗
    </Text>
  );
};

export const formatDate = (value: string) => dayjs(value).format("YYYY-MM-DD");
export const formatDateE = (value: string) =>
  dayjs(value).format("YYYY-MM-DD HH:mm:ss");
