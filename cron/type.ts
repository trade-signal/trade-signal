export type IndicatorType = "date" | "string" | "number" | "boolean" | "array";

export type IndicatorMapping = Record<
  string,
  { type: IndicatorType; cn: string; map?: string }
>;
