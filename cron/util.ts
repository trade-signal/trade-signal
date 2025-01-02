import dayjs from "dayjs";
import { IndicatorMapping, IndicatorType } from "./type";

export const createLogger =
  (name: string, prefix?: string) => (message: string) => {
    console.log(`${prefix ? `[${prefix}]` : ""}[${name}] ${message}`);
  };

export const normalizeValue = (type: IndicatorType, value: string) => {
  if (type === IndicatorType.DATE) {
    return value ? dayjs(value).format("YYYY-MM-DD") : "";
  }
  if (type === IndicatorType.NUMBER) {
    return Number(value) || 0;
  }
  if (type === IndicatorType.BOOLEAN) {
    return value === "1";
  }
  if (type === IndicatorType.ARRAY) {
    return Array.isArray(value) ? value.join(",") : value;
  }
  return value || "";
};

export const arrayToObject = (array: any[]) => {
  return array.reduce((acc, cur) => ({ ...acc, ...cur }), {});
};

export const getIndicatorFields = (indicatorMapping: IndicatorMapping) => {
  return Object.values(indicatorMapping)
    .map(item => item.map)
    .join(",");
};

export const transformStockData = (
  data: any[],
  indicatorMapping: IndicatorMapping
) => {
  const keys = Object.keys(indicatorMapping);

  return data.map((item: any) =>
    arrayToObject(
      keys.map(key => {
        const { type, map } = indicatorMapping[key];

        return {
          [key]: normalizeValue(type, item[map as string])
        };
      })
    )
  );
};
