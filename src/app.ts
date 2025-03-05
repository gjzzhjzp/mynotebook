import { createApp,provide } from 'vue'
import './app.scss'
const user_dll = require('./common/user_dll');
const App = createApp({
  onShow (options) {

  },
  async onLaunch () {
    let appconfig=await user_dll.login();
    provide("globalData",appconfig);
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

export default App
