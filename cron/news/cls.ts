import { get } from "@/shared/request";
import { md5Encrypt, sha1Encrypt } from "@/shared/encrypt";
import dayjs from "dayjs";
import { delayRandom } from "@/shared/util";
import { getCurrentUnixTime } from "@/shared/date";
import prisma from "@/prisma/db";
import Task from "@/cron/common/task";

import { createLogger } from "@/cron/util";

const spider_name = "cls";
const print = createLogger(spider_name, "news");

const generateSign = (params: Record<string, any>) => {
  const str = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join("&");
  return md5Encrypt(sha1Encrypt(str));
};

/**
 * 24小时电报
 *
 * 财联社 - 24小时电报
 * https://www.cls.cn/telegraph
 *
 * @param category 分类
 * @param lastTime 时间戳
 */

const fetchNews = async (category: string, lastTime?: number) => {
  try {
    const url = `https://www.cls.cn/v1/roll/get_roll_list`;

    const baseParams = {
      app: "CailianpressWeb",
      category: category || "",
      last_time: lastTime || getCurrentUnixTime(),
      os: "web",
      refresh_type: 1,
      rn: 20,
      sv: "8.4.6"
    };

    const response = await get(url, {
      ...baseParams,
      sign: generateSign(baseParams)
    });

    if (response.errno != 0) {
      throw new Error(`获取24小时电报失败: ${response.msg}`);
    }

    return response.data && response.data.roll_data;
  } catch (error) {
    return [];
  }
};

// 财联社分类
export const CLS_CATEGORIES = [
  {
    label: "全部",
    value: ""
  },
  {
    label: "重点",
    value: "red"
  },
  {
    label: "公司",
    value: "announcement"
  },
  {
    label: "看盘",
    value: "watch"
  },
  {
    label: "港美股",
    value: "hk_us"
  },
  {
    label: "基金",
    value: "fund"
  }
];

export const getCategoryName = (value: string) => {
  return CLS_CATEGORIES.find(item => item.value === value)?.label;
};

// 获取近24小时数据
export const getNews = async () => {
  const newsMap = new Map<string, ClsNews[]>(
    CLS_CATEGORIES.map(category => [category.value, []])
  );

  print(`开始获取财联社新闻数据`);

  for (const category of CLS_CATEGORIES) {
    let lastTime = getCurrentUnixTime();
    let page = 1;

    while (true) {
      try {
        const data = await fetchNews(category.value, lastTime);

        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error(`${category.label} 分类数据获取失败: 数据为空`);
        }

        // 合并数据
        newsMap.set(category.value, [
          ...(newsMap.get(category.value) || []),
          ...data
        ]);

        lastTime = data[data.length - 1].ctime;

        const time = dayjs(lastTime * 1e3);

        // 如果时间超过24小时前，或者页码大于30，则停止
        if (time.isBefore(dayjs().subtract(24, "hours")) || page >= 30) {
          break;
        }

        page++;
      } catch (error) {
        print(`${category.label} 分类数据获取失败: ${error}`);
        break;
      }
    }

    // 随机延迟
    await delayRandom();
  }

  print(`财联社新闻数据获取完成`);

  return newsMap;
};

interface StockInfo {
  rise_range_has_null: number;
  RiseRange: number;
  name: string;
  StockID: string;
  schema: string;
  status: string;
  last: number;
  is_stib: boolean;
}

interface AdInfo {
  id: number;
  title: string;
  img: string;
  url: string;
  monitorUrl: string;
  video_url: string;
  adTag: string;
  fullScreen: number;
  type: number;
}

interface Subject {
  article_id: number;
  subject_id: number;
  subject_name: string;
  subject_img: string;
  subject_description: string;
  category_id: number;
  attention_num: number;
  is_attention: boolean;
  is_reporter_subject: boolean;
  plate_id: number;
  channel: string;
}

interface InvestCalendar {
  id: number;
  data_id: number;
  r_id: string;
  type: number;
  calendar_time: string;
  setting_time: string;
  event: null;
  economic: null;
  short_latents: null;
}

interface ClsNews {
  author_extends: string;
  assocFastFact: null;
  depth_extends: string;
  deny_comment: number;
  level: string;
  reading_num: number;
  content: string;
  in_roll: number;
  recommend: number;
  confirmed: number;
  jpush: number;
  img: string;
  user_id: number;
  is_top: number;
  brief: string;
  id: number;
  ctime: number;
  type: number;
  title: string;
  bold: number;
  sort_score: number;
  comment_num: number;
  modified_time: number;
  status: number;
  collection: number;
  has_img: number;
  category: string;
  shareurl: string;
  share_img: string;
  share_num: number;
  sub_titles: any[];
  tags: any[];
  imgs: any[];
  images: any[];
  explain_num: number;
  stock_list: StockInfo[];
  is_ad: number;
  ad: AdInfo;
  subjects: Subject[];
  audio_url: string[];
  author: string;
  plate_list: any[];
  assocArticleUrl: string;
  assocVideoTitle: string;
  assocVideoUrl: string;
  assocCreditRating: any[];
  invest_calendar: InvestCalendar;
  share_content: string;
  gray_share: number;
  comment_recommand: null;
  timeline: null;
}

// 转换新闻数据
const transformClsNews = (data: Map<string, ClsNews[]>) => {
  const result = [];

  print(`start transform cls news`);

  for (const [category, news] of data) {
    for (const item of news) {
      const {
        id,
        content,
        shareurl,
        title,
        brief,
        ctime,
        subjects,
        stock_list
      } = item;

      result.push({
        source: "cls",
        sourceId: String(id),
        sourceUrl: shareurl,
        title: title,
        summary: brief,
        content: content,
        date: new Date(ctime * 1e3),
        // hack: use subject_name as tags
        tags: subjects?.map(item => item.subject_name) || [],
        categories: [category],
        stocks:
          stock_list?.map(item => ({
            market: "",
            code: item.StockID,
            name: item.name
          })) || []
      });
    }
  }

  print(`cls news transform end`);

  return result;
};

export const fetchClsNews = async () => {
  const task = new Task("news", "cls");

  try {
    await task.updateStatus("fetching");
    const newsData = await getNews();

    await task.updateStatus("transforming");
    const transformedNews = transformClsNews(newsData);

    print(`transformed ${transformedNews.length} news`);

    print(`start write news`);

    await prisma.news.createMany({
      data: transformedNews,
      skipDuplicates: true // 跳过重复记录
    });
    await task.updateStatus("completed", transformedNews.length);

    print(`write news success`);
  } catch (error) {
    await task.updateStatus("failed");
    print(`getNews error: ${error}`);
  }
};
