# vue-router 有哪几种导航钩子

## 全局导航钩子（跳转前进行判断拦截）

- router.beforeEach(to, from, next)

- router.beforeResolve(to, from, next)

- router.afterEach(to, from ,next)

## 组件内钩子

- beforeRouteEnter

- beforeRouteUpdate

- beforeRouteLeave

## 单独路由独享组件

路由配置上直接可以设置

- beforeEnter
