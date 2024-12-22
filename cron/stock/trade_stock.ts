import { get } from "@/shared/request";
import prisma from "@/prisma/db";
import { createLogger } from "../util";

const spider_name = "trade_stock";
const print = createLogger(spider_name, "stock");

/**
 * 沪深京 A 股-实时行情
 *
 * 东方财富网-沪深京 A 股-实时行情
 * https://quote.eastmoney.com/center/gridlist.html#hs_a_board
 *
 */
const getTradeStock = async () => {};
