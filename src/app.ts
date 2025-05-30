import { createApp, provide, ref } from 'vue'
import './assets/iconfont/iconfont.css'
import './app.scss'
const user_dll = require('./common/user_dll');
import { ConfigProvider } from '@nutui/nutui-taro'
import Taro from '@tarojs/taro'
const appconfig = require('./config');
// 创建全局数据引用
const globalData = ref({});
const App = createApp({
  onShow(options) {
    Taro.showShareMenu({
      withShareTicket: true
    });
  },
  async onLaunch() {

    Taro.setStorageSync("globalData", appconfig)
    let data = await user_dll.login();
    data.currency = data.userinfo.currency;
    console.log("------------data", data)
    Taro.setStorageSync("globalData", data)
    let categories = await user_dll.getCategories();
    Object.assign(data, categories);
    Taro.setStorageSync("globalData", data)
    console.log("globalData", data)
    globalData.value = data;
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
// 在应用实例创建后立即提供全局数据
App.provide('globalData', globalData);
App.use(ConfigProvider);
export default App



