export const transformAlign = (align: Column["align"]) => {
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  return "center";
};

export const generateRowKey = (
  index: number,
  orderBy?: string,
  order?: string
) => `row-${index}-${orderBy || ""}-${order || ""}`;
