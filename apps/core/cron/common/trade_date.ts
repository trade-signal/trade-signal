import dayjs from "dayjs";
import { createLogger } from "@/packages/shared/logger";
import { getTradeDate } from "../api";

const spider_name = "trade_date";
const logger = createLogger(spider_name);

let tradeDates: string[] = [];

const clearTradeDates = () => {
  tradeDates = [];
};

const getTradeDates = async () => {
  if (tradeDates.length === 0) {
    const dates = await getTradeDate();
    tradeDates = dates;
  }
  return tradeDates;
};

export const refreshTradeDates = async () => {
  try {
    logger.info("refresh trade dates");
    clearTradeDates();
    await getTradeDates();
    logger.info("refresh trade dates success");
  } catch (error) {
    logger.error(`refresh trade dates error: ${error}`);
  }
};

export const isTradeDate = (date?: string) => {
  const tradeDate = dayjs(date).format("YYYY-MM-DD");
  return tradeDates.includes(tradeDate);
};
