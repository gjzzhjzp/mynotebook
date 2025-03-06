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
    Taro.setStorageSync("globalData", appconfig)
    let globalData=await user_dll.login();
    Taro.setStorageSync("globalData", globalData)
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

export default App
