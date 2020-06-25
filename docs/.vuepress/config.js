const autobarConfig = require('./config/autobarConfig')
const live2dConfig = require('./config/live2dConfig')
/**
 * config 涉及github帐号信息，文件改为 myTalkConfig copy.js
 * 复制一份，改为myTalkConfig.js，修改对应配置即可
 */
const myTalkConfig = require('./config/myTalkConfig')

module.exports = {
  dest: './dist', // 打包路径
  base: '/front-end-knowledge/', // 打包的基准
  plugins: [
    'rpurl',
    '@vuepress/back-to-top',
    'vuepress-plugin-zooming',
    ['autobar', autobarConfig],
    ['vuepress-plugin-helper-live2d', live2dConfig],
    ['vuepress-plugin-mygitalk', myTalkConfig]
  ],
  title: 'knowledge',
  description: "Let's learn together",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
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
