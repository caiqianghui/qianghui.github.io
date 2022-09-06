export default {
  pages: [
    'pages/main/workbench/index',
    'pages/main/workbench/cloud/signin/index',
    'pages/main/workbench/cloud/signin/list/index',
    'pages/main/workbench/cloud/signin/show/index',
    'pages/main/workbench/zoho/list/index',
    'pages/main/workbench/zoho/show/index',
    'pages/main/workbench/zoho/form/index',
    'pages/main/workbench/cloud/management/index',
    'pages/main/workbench/cloud/approval/index',
    'pages/main/workbench/zoho/accounts_h/index',
    'pages/main/workbench/zoho/information_h/index',
    'pages/main/home/index',
    'pages/main/me/index',
    'pages/main/workbench/cloud/list/index',
    'pages/main/workbench/cloud/show/index',
    'pages/main/workbench/cloud/form/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#999',
    fontSize: '15px',
    selectedColor: '#4a93ed',
    backgroundColor: '#FFF',
    borderStyle: 'black',
    list: [
      {
        iconPath: 'assets/image/tabbar/home.svg',
        selectedIconPath: 'assets/image/tabbar/home_s.svg',
        text: '首页',
        pagePath: 'pages/main/home/index',
      },
      {
        iconPath: 'assets/image/tabbar/modular.svg',
        selectedIconPath: 'assets/image/tabbar/modular_s.svg',
        text: '工作台',
        pagePath: 'pages/main/workbench/index',
      },
      {
        iconPath: 'assets/image/tabbar/user.svg',
        selectedIconPath: 'assets/image/tabbar/user_s.svg',
        text: '我的',
        pagePath: 'pages/main/me/index',
      },
    ]
  }
}
