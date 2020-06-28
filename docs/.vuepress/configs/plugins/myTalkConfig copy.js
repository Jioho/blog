module.exports = {
  // 是否启用(关闭请设置为false)(default: true)
  enable: true,
  // 是否开启首页评论(default: true)
  home: true,
  // Gitalk配置
  gitalk: {
    // GitHub Application Client ID.
    clientID: 'github的 clientID',
    // GitHub Application Client Secret.
    clientSecret: 'github clientSecret',
    // GitHub repository. 存储评论的 repo
    repo: 'github仓库名称，只需要仓库名称',
    // GitHub repository 所有者，可以是个人或者组织。
    owner: '所有者，可以是个人或者组织',
    // 设置语言(default: zh-CN)
    language: 'zh-CN'
  }
}
