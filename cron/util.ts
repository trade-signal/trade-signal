import dayjs from "dayjs";
import { IndicatorType } from "./type";

export const createLogger =
  (name: string, prefix?: string) => (message: string) => {
    console.log(`${prefix ? `[${prefix}]` : ""}[${name}] ${message}`);
  };

export const normalizeValue = (type: IndicatorType, value: string) => {
  if (type === "date") {
    return dayjs(value).format("YYYY-MM-DD");
  }
  if (type === "number") {
    return Number(value) || 0;
  }
  if (type === "boolean") {
    return value === "1";
  }
  if (type === "array") {
    return Array.isArray(value) ? value.join(",") : value;
  }
  return value || "";
};

export const arrayToObject = (array: any[]) => {
  return array.reduce((acc, cur) => ({ ...acc, ...cur }), {});
};
