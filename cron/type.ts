export enum IndicatorType {
  DATE = "date",
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  ARRAY = "array"
}

export type IndicatorMapping = Record<
  string,
  { type: IndicatorType; cn: string; map?: string }
>;
