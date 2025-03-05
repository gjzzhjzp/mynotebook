import Taro from '@tarojs/taro';
// import getCsrfToken from './csrf';
const appconfig = require('../config');
interface IRequestOptions {
  method?: 'GET' | 'POST';
  url: string;
  data?: any;
  validateStatus?: (status: number) => boolean;
}
interface IResponse {
  code: number;
  data: any;
}

// 新增基础请求方法
const request = (options: IRequestOptions) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: appconfig.goapi_server + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': appconfig.token ? `Bearer ${appconfig.token}` : '',
        'x-csrf-token':appconfig.csrf_token||""
      },
      success: (res: any) => {
        const responseData = res.data as IResponse;
        if (options.validateStatus ? options.validateStatus(responseData.code) : responseData.code === 200) {
          resolve(responseData);
        } else {
          reject(new Error(`请求失败: ${responseData.data || '未知错误'}`));
        }
      },
      fail: (err) => reject(err)
    });
  });
}

// 新增 GET 封装
const get = (url: string, data: any) => {
  return request({
    method: 'GET',
    url: url,
    data
  });
}

// 新增 POST 封装
const post = (url: string, data: any) => {
  return request({
    method: 'POST',
    url,
    data
  });
}
export default {
  request,
  get,
  post,
  appconfig
};

// 修改后的登录方法（示例用法）

