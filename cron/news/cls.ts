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
 * @param page 页码
 * @param pageSize 每页数量
 */

const fetchNews = async (lastTime?: number) => {
  try {
    const url = `https://www.cls.cn/v1/roll/get_roll_list`;

    const baseParams = {
      app: "CailianpressWeb",
      category: "",
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
  const news = [];

  let lastTime = getCurrentUnixTime();
  let page = 1;

  while (true) {
    print(`正在获取第${page}页数据`);

    try {
      const data = await fetchNews(lastTime);

      if (!data || !Array.isArray(data)) {
        throw new Error(`获取24小时电报失败: 数据为空`);
      }

      news.push(...data);

      lastTime = data[data.length - 1].ctime;

      const time = dayjs(lastTime * 1e3);

      print(`获取24小时电报成功: ${data.length} 条数据`);

      // 随机延迟
      await delayRandom();

      // 如果时间超过24小时前，或者页码大于30，则停止
      if (time.isBefore(dayjs().subtract(24, "hours")) || page >= 30) {
        print(`已获取近24小时数据`);
        break;
      }

      page++;
    } catch (error) {
      print(`获取24小时电报失败: ${error}`);
      break;
    }
  }

  return news;
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
const transformClsNews = (data: ClsNews[]) => {
  return data.map((item: ClsNews) => {
    const { id, content, shareurl, title, brief, ctime, subjects, stock_list } =
      item;

    return {
      source: "cls",
      sourceId: String(id),
      sourceUrl: shareurl,
      title: title,
      summary: brief,
      content: content,
      date: new Date(ctime * 1e3),
      // hack: use subject_name as tags
      tags: subjects?.map(item => item.subject_name) || [],
      categories: [],
      stocks:
        stock_list?.map(item => ({
          code: item.StockID,
          market: item.schema,
          name: item.name
        })) || []
    };
  });
};

export const seedClsNews = async () => {
  try {
    const newsData = await getNews();
    print(`获取到 ${newsData.length} 条新闻`);

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
