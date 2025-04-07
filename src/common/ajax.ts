import Taro from '@tarojs/taro';
// import getCsrfToken from './csrf';
const appconfig = require('../config');
// ... 保留原有导入和配置 ...

interface IRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  validateStatus?: (status: number) => boolean;
  timeout?: number;
}

interface IResponse<T = any> {
  code: number;
  data: T;
  message?: string;
  total?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10秒超时
const ignoreUrls = ["/login"];
const request = async <T = any>(options: IRequestOptions): Promise<IResponse<T>> => {
  const globalData = Taro.getStorageSync("globalData");
  try {
    const res = await Taro.request({
      url: globalData.goapi_server + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': globalData.token ? `Bearer ${globalData.token}` : ''
      },
      timeout: options.timeout || DEFAULT_TIMEOUT
    });

    const responseData = res.data as IResponse<T>;
    if (options.validateStatus ? options.validateStatus(responseData.code) : responseData.code === 200) {
      return responseData;
    }
    throw new Error(responseData.message || '请求失败');
  } catch (error) {
    throw new Error(`请求失败: ${error.message}`);
  }
}

const get = async <T = any>(url: string, data?: any): Promise<IResponse<T>> => {
  if (ignoreUrls.includes(url)) {
    return request<T>({
      method: 'GET',
      url,
      data
    });
  }
  await checkPost();
  return request<T>({
    method: 'GET',
    url,
    data
  });
}

const post = async <T = any>(url: string, data: any): Promise<IResponse<T>> => {
 
  if (ignoreUrls.includes(url)) {
    return request<T>({
      method: 'POST',
      url,
      data
    });
  }
  await checkPost();
  return request<T>({
    method: 'POST',
    url,
    data
  });
}

const checkPost = async (): Promise<void> => {
  return new Promise((resolve) => {
    const check = () => {
      const globalData = Taro.getStorageSync("globalData");
      if (globalData?.token) {
        resolve();
      } else {
        setTimeout(check, 500);
      }
    };
    check();
  });
}

export default {
  request,
  get,
  post,
  appconfig
};

// 修改后的登录方法（示例用法）

