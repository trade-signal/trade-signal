import { get } from "@/shared/request";
import { md5Encrypt, sha1Encrypt } from "@/shared/encrypt";
import { getCurrentUnixTime } from "@/shared/date";

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
export const getClsNews = async (category: string, lastTime?: number) => {
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
