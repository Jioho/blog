const autobar_options = {
  stripNumbers: true,
  maxLevel: 3,
  skipEmptySidebar: true,
  skipEmptyNavbar: true,
  multipleSideBar: true,
  setHomepage: 'hide'
}

module.exports = {
  dest: './dist', // 打包路径
  base: '/front-end-knowledge/', // 打包的基准
  plugins: ['autobar', autobar_options, '@vuepress/back-to-top'], // 自动生成侧边栏
  title: 'knowledge',
  description: "Let's learn together",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  markdown: {
    lineNumbers: false
  },
  themeConfig: {
    sidebar: 'auto', // 自动生成侧边栏
    displayAllHeaders: true, // 显示所有页面的标题链接
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'JavaScript',
        link: '/02.JavaScript/01.基础'
      },
      {
        text: 'CSS',
        link: '/03.CSS/01.基础'
      },
      {
        text: 'HTML',
        link: '/04.HTML/01.基础'
      },
      {
        text: 'Vue',
        link: '/05.Vue/01.基础'
      },
      {
        text: '小程序',
        link: '/06.小程序/01.基础'
      },
      { text: 'Gitee', link: 'https://gitee.com/Jioho/front-end-knowledge' }
    ],
    sidebarDepth: 1,
    lastUpdated: 'Last Updated'
  }
}
