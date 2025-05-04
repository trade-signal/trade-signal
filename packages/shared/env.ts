export const isProduction = process.env.NODE_ENV === "production";

export const isDev = process.env.NODE_ENV === "development";

export const getRefetchInterval = () => {
  // 生产环境每分钟刷新一次，开发环境每30分钟刷新一次
  return isProduction ? 1000 * 60 : 1000 * 60 * 30;
};
