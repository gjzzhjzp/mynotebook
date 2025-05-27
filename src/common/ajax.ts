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
// 上传图片
const uploadImage = async (tempPath: string) => {
  const globalData = Taro.getStorageSync("globalData");
  try {
    const res = await Taro.uploadFile({
      url: globalData.goapi_server + '/common/uploadImage', // 替换为你的上传接口
      filePath: tempPath,
      name: 'file',
      formData: {
        type: 'memo_image'
      },
      header: {
        'Authorization': globalData.token ? `Bearer ${globalData.token}` : ''
      },
    });

    if (res.statusCode === 200) {
      const data = JSON.parse(res.data);
      if (data.code === 200) {
        return data.data.url; // 假设返回结构包含data.url
      }
    }
    throw new Error('上传失败');
  } catch (err) {
    Taro.showToast({ title: '图片上传失败', icon: 'none' });
    console.error('上传错误:', err);
    return null;
  }
}

export default {
  request,
  get,
  post,
  checkPost,
  appconfig,
  uploadImage
};

// 修改后的登录方法（示例用法）

