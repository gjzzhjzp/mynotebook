import { createApp,provide } from 'vue'
import './assets/iconfont/iconfont.css'
import './app.scss'
const user_dll = require('./common/user_dll');
import Taro from '@tarojs/taro'
const appconfig = require('./config');
const App = createApp({
  onShow (options) {

  },
  async onLaunch () {
    // debugger;
    Taro.setStorageSync("globalData", appconfig)
    let globalData=await user_dll.login();
    Taro.setStorageSync("globalData", globalData)
    let categories=await user_dll.getCategories();
    Object.assign(globalData,categories);
    console.log("globalData",globalData);
    Taro.setStorageSync("globalData", globalData)
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

export default App



