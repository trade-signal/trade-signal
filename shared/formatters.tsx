import dayjs from "dayjs";
import { getThemeSetting } from "./theme";

export const getColor = (value: number) => {
  const themeSetting = getThemeSetting();
  if (value > 0) return themeSetting.upColor;
  if (value < 0) return themeSetting.downColor;
  return "gray.7";
};

export const getUpDownColor = (type: "up" | "down", value: number) => {
  const themeSetting = getThemeSetting();
  if (type === "up" && value !== 0) return themeSetting.upColor;
  if (type === "down" && value !== 0) return themeSetting.downColor;
  return "gray.7";
};

export const formatPercent = (value: number, decimals = 2, withSign = true) => {
  if (!value && value !== 0) return "-";
  const val = value.toFixed(decimals) + "%";
  return withSign ? val : val.replace("%", "");
};

export const formatNumber = (value: number, decimals = 2) => {
  if (!value && value !== 0) return "-";
  return value.toFixed(decimals);
};

export const formatBillion = (value: number) => {
  if (!value && value !== 0) return "-";
  return (value / 100000000).toFixed(2);
};

export const formatLargeNumber = (value: number) => {
  if (!value && value !== 0) return "-";

  const units = [
    { value: 1e12, unit: "万亿" },
    { value: 1e8, unit: "亿" },
    { value: 1e4, unit: "万" },
    { value: 1, unit: "" }
  ];

  for (const { value: unitValue, unit } of units) {
    if (Math.abs(value) >= unitValue) {
      const formatted = (value / unitValue).toFixed(2);
      const display = formatted.replace(/\.00$/, "");
      return `${display}${unit}`;
    }
  }

  return "0";
};

export const formatDate = (value: string) => dayjs(value).format("YYYY-MM-DD");
export const formatDateE = (value: string) =>
  dayjs(value).format("YYYY-MM-DD HH:mm:ss");
