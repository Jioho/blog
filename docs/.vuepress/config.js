module.exports = {
  dest: './dist', // 打包路径
  base: '/front-end-knowledge/', // 打包的基准
  plugins: require('./configs/plugins/index'), // 配置插件
  markdown: {
    lineNumbers: true
  },
  title: 'knowledge',
  description: "Let's learn together",
  head: require('./configs/head/index'), // 添加百度统计等插件
  themeConfig: {
    sidebar: 'auto', // 自动生成侧边栏
    displayAllHeaders: false, // 显示所有页面的标题链接
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CSDN', link: 'https://blog.csdn.net/Jioho_chen' },
      { text: 'Gitee', link: 'https://gitee.com/Jioho/front-end-knowledge' },
      { text: 'Github', link: 'https://github.com/Jioho/front-end-knowledge' }
    ],
    sidebarDepth: 100, // 侧边栏深度
    lastUpdated: 'Last Updated'
  }
}
