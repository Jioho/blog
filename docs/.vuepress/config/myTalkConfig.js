module.exports = {
  // 是否启用(关闭请设置为false)(default: true)
  enable: true,
  // 是否开启首页评论(default: true)
  home: true,
  // Gitalk配置
  gitalk: {
    // GitHub Application Client ID.
    clientID: '49e2f73064ceca951e48',
    // GitHub Application Client Secret.
    clientSecret: '7aded260c86a63355c5e34afddd3902057ef6c0b',
    // GitHub repository. 存储评论的 repo
    repo: 'https://github.com/Jioho/front-end-knowledge',
    // GitHub repository 所有者，可以是个人或者组织。
    owner: 'Jioho',
    // 设置语言(default: zh-CN)
    language: 'zh-CN'
  }
}
