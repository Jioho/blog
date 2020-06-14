const autobar_options = {
  stripNumbers: true,
  maxLevel: 2,
  skipEmptySidebar: true,
  skipEmptyNavbar: true,
  multipleSideBar: false,
  setHomepage: 'hide'
}

module.exports = {
  dest: './dist', // 打包路径
  base: '/front-end-knowledge/', // 打包的基准
  plugins: [['autobar', autobar_options], '@vuepress/back-to-top'], // 自动生成侧边栏
  title: 'knowledge',
  description: "Let's learn together",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  markdown: {
    lineNumbers: true,
    config: md => {
      md.use(require('markdown-it-task-lists'))
    }
  },
  themeConfig: {
    sidebar: 'auto', // 自动生成侧边栏
    displayAllHeaders: false, // 显示所有页面的标题链接
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CDNS', link: 'https://blog.csdn.net/Jioho_chen' },
      { text: 'Gitee', link: 'https://gitee.com/Jioho/front-end-knowledge' }
    ],
    sidebarDepth: 100, // 侧边栏深度
    lastUpdated: 'Last Updated'
  }
}
