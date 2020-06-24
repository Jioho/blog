const autobarConfig = {
  stripNumbers: true,
  maxLevel: 2,
  skipEmptySidebar: true,
  skipEmptyNavbar: true,
  multipleSideBar: false,
  setHomepage: 'hide'
}

const live2dConfig = {
  live2d: {
    // 是否启用(关闭请设置为false)(default: true)
    enable: true,
    // 模型名称(default: hibiki)>>>取值请参考：
    // https://github.com/JoeyBling/hexo-theme-yilia-plus/wiki/live2d%E6%A8%A1%E5%9E%8B%E5%8C%85%E5%B1%95%E7%A4%BA
    model: 'hijiki',
    display: {
      position: 'right', // 显示位置：left/right(default: 'right')
      width: 180, // 模型的长度(default: 135)
      height: 400, // 模型的高度(default: 300)
      hOffset: 0, //  水平偏移(default: 65)
      vOffset: -30 //  垂直偏移(default: 0)
    },
    mobile: {
      show: false // 是否在移动设备上显示(default: false)
    },
    react: {
      opacity: 1 // 模型透明度(default: 0.8)
    }
  }
}

module.exports = {
  dest: './dist', // 打包路径
  base: '/front-end-knowledge/', // 打包的基准
  plugins: [
    ['autobar', autobarConfig],
    '@vuepress/back-to-top',
    ['vuepress-plugin-helper-live2d', live2dConfig]
  ], // 自动生成侧边栏
  title: 'knowledge',
  description: "Let's learn together",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    sidebar: 'auto', // 自动生成侧边栏
    displayAllHeaders: false, // 显示所有页面的标题链接
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CSDN', link: 'https://blog.csdn.net/Jioho_chen' },
      { text: 'Gitee', link: 'https://gitee.com/Jioho/front-end-knowledge' }
    ],
    sidebarDepth: 100, // 侧边栏深度
    lastUpdated: 'Last Updated'
  }
}
