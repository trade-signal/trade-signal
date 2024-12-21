import dayjs from "dayjs";

interface RunDateConfig {
  hour: number;
  minute: number;
}

// 获取运行日期
export const getRunDate = (config: RunDateConfig = { hour: 16, minute: 0 }) => {
  const now = dayjs();
  const currentHour = now.hour();
  const currentMinute = now.minute();

  // 获取最近的工作日
  const getLastWorkday = (date: dayjs.Dayjs) => {
    const day = date.day();
    if (day === 0) return date.subtract(2, "day"); // 周日 -> 周五
    if (day === 6) return date.subtract(1, "day"); // 周六 -> 周五
    return date;
  };

  // 判断是否在收盘数据处理时间之前，默认 16:00 之前
  const isBeforeClosingTime =
    currentHour < config.hour ||
    (currentHour === config.hour && currentMinute < config.minute);

  // 获取基准日期：收盘前取前一天，收盘后取当天
  const baseDate = isBeforeClosingTime ? now.subtract(1, "day") : now;

  // 返回最近的工作日
  return getLastWorkday(baseDate).format("YYYY-MM-DD");
};

// 获取当前时间戳
export const getCurrentUnixTime = () => dayjs().unix();
