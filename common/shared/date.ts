import dayjs from "dayjs";

export const formatDate = (
  date: Date,
  format: string = "YYYY-MM-DD"
): string => {
  return dayjs(date).format(format);
};

export const parseDate = (
  date: string,
  format: string = "YYYY-MM-DD"
): Date => {
  return dayjs(date, format).toDate();
};
