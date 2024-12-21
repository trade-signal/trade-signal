import { get } from "@/shared/request";
import { createLogger } from "@/cron/util/logger";
import { md5Encrypt, sha1Encrypt } from "@/shared/encrypt";
import dayjs from "dayjs";
import { delayRandom } from "@/shared/util";
import { getCurrentUnixTime } from "@/shared/date";
import prisma from "@/prisma/db";

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

// 获取近24小时数据
export const getNews = async () => {
  const newsMap = new Map<string, ClsNews[]>(
    CLS_CATEGORIES.map(category => [category.value, []])
  );

  for (const category of CLS_CATEGORIES) {
    let lastTime = getCurrentUnixTime();
    let page = 1;

    print(`开始获取 ${category.label} 分类数据`);

    while (true) {
      try {
        const data = await fetchNews(category, lastTime);

        if (!data || !Array.isArray(data)) {
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
          print(`${category.label} 分类数据获取完成`);
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

  for (const [category, news] of data) {
    print(`开始转换"${category}"分类数据`);

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
            code: item.StockID,
            market: item.schema,
            name: item.name
          })) || []
      });
    }

    print(`转换"${category}"分类数据完成`);
  }

  return result;
};

export const seedClsNews = async () => {
  try {
    const newsData = await getNews();
    print(`获取数据完成`);

    print(`开始转换新闻数据`);
    const transformedNews = transformClsNews(newsData);

    print(`开始写入数据库`);
    await prisma.$transaction(async tx => {
      const results = await Promise.all(
        transformedNews.map(news =>
          tx.news.upsert({
            where: {
              source_sourceId: {
                source: news.source,
                sourceId: news.sourceId
              }
            },
            create: news,
            update: news
          })
        )
      );

      print(`成功处理 ${results.length} 条新闻数据`);
    });
  } catch (error) {
    print(`处理新闻数据失败: ${error}`);
  }
};
