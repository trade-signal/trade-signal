import { createLogger } from "@/cron/util";
import { get } from "@/shared/request";

const spider_name = "eastmoney";
const print = createLogger(spider_name, "stock");

// 获取随机数（用于请求参数 1-100）
const getRandomNumber = () => {
  return Math.floor(Math.random() * 100) + 1;
};

// 获取东方财富网股票数据
const getEastMoneyStockQuotes = async (params: any) => {
  try {
    const randomNumber = getRandomNumber();
    const url = `http://${randomNumber}.push2.eastmoney.com/api/qt/clist/get`;

    const response = await get(url, params);

    if (response.data && response.data.diff) {
      return response.data.diff;
    }

    throw new Error(
      `getEastMoneyStockQuotes error: ${response.message || "unknown error"}`
    );
  } catch (error) {
    print(`getEastMoneyStockQuotes error: ${error}`);
    return [];
  }
};

/**
 * 沪深京 A 股-实时行情
 *
 * 东方财富网-沪深京 A 股-实时行情
 * https://quote.eastmoney.com/center/gridlist.html#hs_a_board
 *
 */
export const getRealtimeStockQuotes = ({ fields }: { fields: string }) => {
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
 * 沪深京 A 股-指数-实时行情
 *
 * 东方财富网-沪深京 A 股-指数信息
 * https://quote.eastmoney.com/center/hszs.html
 */
export const getRealTimeIndexQuotes = ({ fields }: { fields: string }) => {
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
