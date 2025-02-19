import { ColumnAlign } from "./types";

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
