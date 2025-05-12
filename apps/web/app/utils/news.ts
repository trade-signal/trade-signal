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
