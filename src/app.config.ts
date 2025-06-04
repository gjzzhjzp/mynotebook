export default defineAppConfig({
  pages: [
    'pages/index/index'
  ],
  subpackages: [
    {
      "root": "account",
      "pages": [
        "index/index",
        "allAccount/allAccount",
        "statistics/statistics",
        "add/add"
      ]
    },
    {
      "root": "memo",
      "pages": [
        "index/index",
        "add/add"
      ]
    },
    {
      "root": "feedback",
      "pages": [
        "index/index"
      ]
    },
    {
      "root": "entertainment",
      "pages": [
        "index/index",
        "webview/webview"
      ]
    },
    // 经期记录
    {
      "root": "menstrual",
      "pages": [
        "index/index",
         "setting/setting"
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  }
})
