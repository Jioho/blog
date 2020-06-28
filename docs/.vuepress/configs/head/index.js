const isDev = process.env.NODE_ENV === 'development'

const head = [['link', { rel: 'icon', href: '/favicon.ico' }]]

// 添加百度统计
!isDev &&
  head.push([
    'script',
    {},
    `
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?21b6775b18360c4e8a93122bc08e4af4";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
  `
  ])

module.exports = head
