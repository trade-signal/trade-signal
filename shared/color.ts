/*!
 * 颜色类相关工具函数
 */

export type ColorArray = [number, number, number];
export type HexColor = string;
export type RgbaColor = string;

/**
 * 将16进制颜色转换为rgb数组（不包含透明度）
 * @param hex 16进制颜色
 * @returns rgb数组
 */
export const hex2rgbArray = (hex: string): ColorArray => {
  try {
    hex = hex.replace('#', '');
  
    if (hex.length === 3) {
      hex = hex.split('').map(x => x + x).join('');
    }
  
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
  
    return [r, g, b];
  } catch {
    return [0, 0, 0];
  }
}

/**
 * 将16进制颜色转换为rgba颜色
 * @param hex 16进制颜色
 * @param alpha 透明度
 * @returns rgba颜色
 */
export const hex2rgba = (hex: string, alpha = 1): RgbaColor => {
  const rgb = hex2rgbArray(hex);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

/**
 * 将rgb数组转换为16进制颜色
 * @param rgb rgb数组
 * @returns 16进制颜色
 */
export const rgbArray2hex = (rgb: ColorArray) => {
  return `#${rgb.map(item => item.toString(16)).join('')}`;
}

/**
 * 计算颜色的亮度
 * @param color 颜色
 * @returns 亮度值
 */
export const getLuminance = (color: ColorArray): number => {
  // 使用线性化公式计算亮度
  const [r, g, b] = color.map(item => item / 255).map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  // 计算亮度 L = 0.2126*R' + 0.7152*G' + 0.0722*B'
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

/**
 * 计算对比度
 * @param color1 颜色1
 * @param color2 颜色2
 * @returns 对比度值
 */
export const getContrast = (color1: ColorArray, color2: ColorArray): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const light = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);

  return (light + 0.05) / (dark + 0.05);
}

/**
 * 判断字体颜色是否清晰
 * @param bgColor 背景颜色
 * @param textColor 字体颜色
 * @param minContrast 最低对比度 - WCAG要求正文文本的最小对比度为4.5:1
 * @returns 是否清晰
 */
export const isTextReadable = (bgColor: ColorArray, textColor: ColorArray, minContrast = 4.5): boolean => {
  const contrast = getContrast(bgColor, textColor);
  return contrast >= minContrast;
}
