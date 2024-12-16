import dayjs from "dayjs";

// 获取运行日期
export const getRunDate = () => {
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

  // 判断是否在收盘数据处理时间之前（17:30前）
  const isBeforeClosingTime =
    currentHour < 17 || (currentHour === 17 && currentMinute < 30);

  // 获取基准日期：收盘前取前一天，收盘后取当天
  const baseDate = isBeforeClosingTime ? now.subtract(1, "day") : now;

  // 返回最近的工作日
  return getLastWorkday(baseDate).format("YYYY-MM-DD");
};  