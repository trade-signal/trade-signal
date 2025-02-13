import { createLogger } from "@/cron/util";
import { get } from "@/shared/request";

const spider_name = "eastmoney";
const print = createLogger(spider_name, "stock");

// 获取随机数（用于请求参数 1-100）
const getRandomNumber = () => {
  return Math.floor(Math.random() * 100) + 1;
};

// ----------------------- 股票 行情数据 -------------------------------------

// 获取股票 行情数据
const getEastMoneyStockQuotes = async (params: any) => {
  try {
    const randomNumber = getRandomNumber();
    const url = `http://${randomNumber}.push2.eastmoney.com/api/qt/clist/get`;

    const response = await get(url, params);

    if (response.data && response.data.diff) {
      return response.data.diff;
    }

    throw new Error(
      `get ${spider_name} stock quotes error: ${
        response.message || "unknown error"
      }`
    );
  } catch (error) {
    print(`get ${spider_name} stock quotes error: ${error}`);
    return [];
  }
};

// 获取股票 分时数据
const getEastMoneyStockMinuteKline = async (params: any) => {
  try {
    const randomNumber = getRandomNumber();
    const url = `http://${randomNumber}.push2.eastmoney.com/api/qt/stock/trends2/get`;

    const response = await get(url, params);

    if (response.data && response.data.trends) {
      return response.data.trends;
    }

    throw new Error(
      `get ${spider_name} stock minute kline error: ${
        response.message || "unknown error"
      }`
    );
  } catch (error) {
    print(`get ${spider_name} stock minute kline error: ${error}`);
    return [];
  }
};

// ----------------------- 股票 基础信息 -------------------------------------

/**
 * 沪深京个股-基础信息
 *
 * 东方财富网-沪深京个股-基础信息
 * https://quote.eastmoney.com/center/gridlist.html#hs_a_board
 */
export const getStockBasic = async ({ fields }: { fields: string }) => {
  return getEastMoneyStockQuotes({
    pn: "1",
    pz: "50000",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f3",
    fs: "m:0 t:6,m:0 t:80,m:1 t:2,m:1 t:23,m:0 t:81 s:2048",
    fields
  });
};

/**
 * 沪深京指数-基础信息
 *
 * 东方财富网-沪深京指数-基础信息
 * https://quote.eastmoney.com/center/hszs.html
 */
export const getStockIndexBasic = async ({ fields }: { fields: string }) => {
  return getEastMoneyStockQuotes({
    pn: "1",
    pz: "50",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    dect: "1",
    wbp2u: "|0|1|0|web",
    fid: "",
    fs: "b:MK0010",
    fields
  });
};

/**
 * 沪深京板块-基础信息
 *
 * 东方财富网-沪深京板块-基础信息
 * https://quote.eastmoney.com/center/gridlist.html#hs_a_board
 */
export const getStockPlateBasic = async ({ fields }: { fields: string }) => {
  return getEastMoneyStockQuotes({
    pn: "1",
    pz: "200",
    po: "1",
    np: "1",
    ut: "fa5fd1943c7b386f172d6893dbfba10b",
    fltt: "1",
    invt: "2",
    dect: "1",
    wbp2u: "|0|1|0|web",
    fid: "f3",
    fs: "m:90 t:2 f:!50",
    fields
  });
};

// ----------------------- 股票 实时行情 -------------------------------------

/**
 * 沪深京个股-实时行情
 *
 * 东方财富网-沪深京个股-实时行情
 * https://quote.eastmoney.com/center/gridlist.html#hs_a_board
 *
 */
export const getStockQuotes = ({ fields }: { fields: string }) => {
  return getEastMoneyStockQuotes({
    pn: "1",
    pz: "50000",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f3",
    fs: "m:0 t:6,m:0 t:80,m:1 t:2,m:1 t:23,m:0 t:81 s:2048",
    fields
  });
};

/**
 * 沪深京指数-实时行情
 *
 * 东方财富网-沪深京指数-指数信息
 * https://quote.eastmoney.com/center/hszs.html
 */
export const getStockIndexQuotes = ({ fields }: { fields: string }) => {
  return getEastMoneyStockQuotes({
    pn: "1",
    pz: "50",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    dect: "1",
    wbp2u: "|0|1|0|web",
    fid: "",
    fs: "b:MK0010",
    fields
  });
};

/**
 * 沪深京板块-实时行情
 *
 * 东方财富网-沪深京板块-实时行情
 * https://quote.eastmoney.com/center/gridlist.html#hs_a_board
 */
export const getStockPlateQuotes = ({ fields }: { fields: string }) => {
  return getEastMoneyStockQuotes({
    pn: "1",
    pz: "200",
    po: "1",
    np: "1",
    ut: "fa5fd1943c7b386f172d6893dbfba10b",
    fltt: "1",
    invt: "2",
    dect: "1",
    wbp2u: "|0|1|0|web",
    fid: "f3",
    fs: "m:90 t:2 f:!50",
    fields
  });
};

// ----------------------- 股票 分时行情 -------------------------------------

/**
 * 沪深京个股-分时行情
 *
 * 东方财富网-沪深京个股-分时行情
 * https://quote.eastmoney.com/concept/sh603777.html?from=classic
 */
export const getStockMinuteKline = (marketId: number, code: string) => {
  return getEastMoneyStockMinuteKline({
    fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f17",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58",
    ut: "fa5fd1943c7b386f172d6893dbfba10b",
    ndays: "1",
    iscr: "1",
    iscca: "0",
    secid: `${marketId}.${code}`
  });
};

/**
 * 沪深京指数-分时行情
 *
 * 东方财富网-沪深京指数-分时行情
 * https://quote.eastmoney.com/center/hszs.html
 */
export const getStockIndexMinuteKline = (marketId: number, code: string) => {
  return getEastMoneyStockMinuteKline({
    fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f17",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    ndays: "1",
    iscr: "1",
    iscca: "0",
    secid: `${marketId}.${code}`
  });
};
