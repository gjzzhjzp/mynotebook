export default defineAppConfig({
  pages: [
    'pages/index/index'
  ],
  subpackages:[
    {
      "root": "account",
      "pages": [
        "index/index",
        "add/add"
      ]
    },
    {
      "root": "memo",
      "pages": [
        "index/index"
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
