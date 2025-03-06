export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/account/account',
    'pages/memo/memo'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  tabBar:{
    custom:true,
    list:[
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/memo/memo',
        text: '首页',
      }
    ]
  }
})
