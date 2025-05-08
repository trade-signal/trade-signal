export interface SinaNews {
  id: number;
  zhibo_id: number;
  type: number;
  rich_text: string;
  multimedia: string;
  commentid: string;
  compere_id: number;
  creator: string;
  mender: string;
  create_time: string;
  update_time: string;
  is_need_check: string;
  check_time: string;
  check_status: string;
  check_user: string;
  is_delete: number;
  top_value: number;
  is_focus: number;
  source_content_id: string;
  anchor_image_url: string;
  anchor: string;
  ext: string; // JSON字符串
  old_live_cid: string;
  tab: string;
  is_repeat: string;
  tag: Array<{
    id: string;
    name: string;
  }>;
  like_nums: number;
  comment_list: {
    list: any[];
    total: number;
    thread_show: number;
    qreply: number;
    qreply_show: number;
    show: number;
  };
  docurl: string;
  rich_text_nick_to_url: any[];
  rich_text_nick_to_routeUri: any[];
  compere_info: string;
}

export interface SinaNewsExt {
  stocks: Array<{
    market: string;
    symbol: string;
    key: string;
  }>;
  needPushWB: boolean;
  needCMSLink: boolean;
  needCalender: boolean;
  docurl: string;
  docid: string;
}
