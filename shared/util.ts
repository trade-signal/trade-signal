export const parseCommaSeparatedParam = (
  searchParams: URLSearchParams,
  paramName: string
) => {
  const params = searchParams.get(paramName);
  if (!params) return [];
  return params.split(",").filter(item => item.trim());
};

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const delayRandom = (min: number = 1000, max: number = 3000) =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min);
