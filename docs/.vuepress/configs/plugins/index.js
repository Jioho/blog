const isDev = process.env.NODE_ENV === 'development'

const autobarConfig = require('./autobarConfig')
const live2dConfig = require('./live2dConfig')
/**
 * config 涉及github帐号信息，文件改为 myTalkConfig copy.js
 * 复制一份，改为myTalkConfig.js，修改对应配置即可
 */
const myTalkConfig = require('./myTalkConfig')

// 基础插件
const plugins = [
  'rpurl', // url 优化
  '@vuepress/back-to-top', // 返回顶部
  ['autobar', autobarConfig] // 自动侧边栏
]

// 线上才加载的插件
const onLinePlugins = [
  'vuepress-plugin-zooming', // 图片缩放
  'vuepress-plugin-baidu-autopush', // 百度自动推送统计
  ['vuepress-plugin-code-copy', true], // 代码复制
  ['vuepress-plugin-helper-live2d', live2dConfig], // live2d
  ['vuepress-plugin-mygitalk', myTalkConfig] // 评论系统
]

// 打包合并线上插件
!isDev && plugins.push(...onLinePlugins)

module.exports = plugins
