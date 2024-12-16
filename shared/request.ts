const request = async (url: string, options: any, headers: any) => {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...options
  }).then(response => response.json());
};


export const get = (url: string, params: any, headers: any = {}) => {
  const queryString = params ? new URLSearchParams(params).toString() : "";
  return request(`${url}?${queryString}`, { method: "GET" }, headers);
};

export const post = (url: string, data: any, headers: any = {}) =>
  request(url, { method: "POST", body: JSON.stringify(data) }, headers);

export default request;
