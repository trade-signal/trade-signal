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
