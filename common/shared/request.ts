import EnvVars from "@/common/constants/vars";
import request from "@/common/shared/request";

const request = async (url: string, options: any, headers: any) => {
  const baseUrl = EnvVars.API_URL;

  if (!baseUrl) throw new Error("API_URL is not set in environment variables");

  return fetch(`${baseUrl}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...options
  }).then(response => response.json());
};

export const get = (url: string, params, headers: any = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`${url}?${queryString}`, { method: "GET" }, headers);
};

export const post = (url: string, data: any, headers: any = {}) =>
  request(url, { method: "POST", body: JSON.stringify(data) }, headers);

export default request;
