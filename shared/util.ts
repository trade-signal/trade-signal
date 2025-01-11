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

export const hex2rgba = (hex: string, alpha = 1) => {
  try {
    hex = hex.replace('#', '');
  
    if (hex.length === 3) {
      hex = hex.split('').map(x => x + x).join('');
    }
  
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return hex;
  }
}
