import { get } from "@/shared/request";
import prisma from "@/prisma/db";
import { indicatorMapping, IndicatorType } from "@/cron/config/indicator";
import { StockSelection } from "@prisma/client";
import dayjs from "dayjs";
import { delayRandom } from "@/shared/util";

const spider_name = "stock_selection";

const print = (message: string) => {
  console.log(`[${spider_name}] ${message}`);
};

/**
 * 选股指标
 *
 * 东方财富网-个股-选股器
 * https://data.eastmoney.com/xuangu/
 *
 * @param page 页码
 * @param pageSize 每页数量
 */
const getStockSelection = async (page: number, pageSize: number) => {
  try {
    const url = `https://data.eastmoney.com/dataapi/xuangu/list`;

    // 选股指标 初始值 "SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,CHANGE_RATE"
    const sty = Object.values(indicatorMapping)
      .map(item => item.value)
      .join(",");

    // 过滤条件
    // const filter = `(MARKET+in+("上交所主板","深交所主板","深交所创业板","上交所科创板","上交所风险警示板","深交所风险警示板","北京证券交易所"))(NEW_PRICE>0)`;
    const filter = `(MARKET+in+("上交所主板","深交所主板","深交所创业板"))(NEW_PRICE>0)`;

    const response = await get(url, {
      sty,
      filter: filter,
      p: page,
      ps: pageSize,
      source: "SELECT_SECURITIES",
      client: "WEB"
    });

    return response;
  } catch (error) {
    print(`获取选股指标失败: ${error}`);
    return [];
  }
};

const normalizeValue = (type: IndicatorType, value: string) => {
  if (type === "date") {
    return dayjs(value).format("YYYY-MM-DD");
  }
  if (type === "number") {
    return Number(value);
  }
  if (type === "boolean") {
    return value === "1";
  }
  if (type === "array") {
    return Array.isArray(value) ? value.join(",") : value;
  }
  return value || "";
};

const arrayToObject = (array: any[]) => {
  return array.reduce((acc, cur) => ({ ...acc, ...cur }), {});
};

const getStocks = async (): Promise<Partial<StockSelection>[]> => {
  let page = 1;
  let pageSize = 1000;

  const stocks = [];

  const keys = Object.keys(indicatorMapping);

  while (true) {
    print(`正在获取第${page}页数据`);

    try {
      const response = await getStockSelection(page, pageSize);

      if (!response.success) {
        throw new Error(`获取选股指标失败: ${response.message || "未知错误"}`);
      }

      const { count, data } = response.result;

      const list = data.map((item: any) =>
        arrayToObject(
          keys.map(key => {
            const { type, value } = indicatorMapping[key];

            return {
              [key]: normalizeValue(type, item[value])
            };
          })
        )
      );

      stocks.push(...list);

      print(`获取选股指标成功: ${list.length} 条数据`);

      // 随机延迟
      await delayRandom();

      if (!count || page * pageSize >= count) break;

      page++;
    } catch (error) {
      print(`获取选股指标失败: ${error}`);
      break;
    }
  }

  return stocks;
};

export const checkStocks = async (date?: string) => {
  const stocks = await prisma.stockSelection.findMany({
    where: { date: dayjs(date).format("YYYY-MM-DD") }
  });
  return stocks.length > 0;
};

export const seedStockSelection = async (date?: string) => {
  try {
    if (date) {
      // 删除指定日期及之后的所有数据
      const deleted = await prisma.stockSelection.deleteMany({
        where: {
          date: {
            gte: dayjs(date).format("YYYY-MM-DD")
          }
        }
      });
      print(`删除选股指标: ${deleted.count}`);
    }

    print(`开始获取选股指标`);

    // 获取选股指标
    const stocks = await getStocks();

    if (stocks.length === 0) {
      print(`选股指标为空`);
      return;
    }

    print(`选股指标数量: ${stocks.length}`);
    print(`开始写入选股指标`);

    // 写入选股指标
    while (stocks.length > 0) {
      let list = stocks.splice(0, 1000);

      list = list.map(item => ({
        ...item,
        // fix: 量比为空时，取0
        volumeRatio: item.volumeRatio || 0
      }));

      print(`正在写入${list.length}条选股指标`);

      await prisma.stockSelection.createMany({
        data: list as any,
        skipDuplicates: true
      });
    }

    print(`写入选股指标成功`);
  } catch (error) {
    print(`获取选股指标失败: ${error}`);
  }
};

export const initStockSelectionData = async (runDate: string) => {
  const hasStocks = await checkStocks(runDate);

  if (hasStocks) {
    print("Stocks available! No need to seed.");
    return;
  }

  await seedStockSelection(runDate);
};
