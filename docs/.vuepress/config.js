const autobar_options = {
  stripNumbers: true,
  maxLevel: 2,
  skipEmptySidebar: true,
  skipEmptyNavbar: true,
  multipleSideBar: true,
  setHomepage: 'hide'
}

module.exports = {
  dest: './dist', // 打包路径
  base: '/front-end-knowledge/', // 打包的基准
  plugins: ['autobar', autobar_options], // 自动生成侧边栏
  title: '前端知识点汇总',
  description: '前端知识点汇总',
  head: [
    ['link', { rel: 'icon', href: '/public/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    sidebar: 'auto', // 自动生成侧边栏
    displayAllHeaders: true, // 显示所有页面的标题链接
    nav: [
      { text: '主页', link: '/' },
      {
        text: 'vue组件',
        link: '/01.vue组件列表/'
        // item: [
        //   { text: 'Chinese', link: '/language/chinese/' },
        //   { text: 'Japanese', link: '/language/japanese/' }
        // ]
      },
      {
        text: '开发规范',
        link: '/02.开发规范'
      }
      // { text: 'Github', link: 'https://www.github.com/codeteenager' },
    ],
    sidebarDepth: 1,
    lastUpdated: 'Last Updated'
  }
}
