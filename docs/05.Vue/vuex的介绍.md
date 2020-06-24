# vuex 的介绍和基础用法

vuex 其实就是一个 store(仓库)

## store (相当于仓库)

- 提供一个初始的 `state` 对象和 `mutation` 变动的方法

- 然后可以通过 `store.state` 获取对象。通过 `store.commit()` 触发 `mutation`

## state 状态

由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态

每当 store.state.count 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。

## Getter

Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）

> getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的

> getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果(闭包形式，调用 get 返回一个函数)

## Mutation

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation（通过 commit）

### Mutation 需遵守 Vue 的响应规则

1. 最好提前在你的 store 中初始化好所有所需属性
2. 当需要在对象上添加新属性时 使用 `Vue.set(obj, 'newProp', 123)`, 或者 `state.obj = { ...state.obj, newProp: 123 }` 以新对象替换老对象

### Mutation 必须是同步函数

> 因为当 mutation 触发的时候，回调函数还没有被调用
> 任何在回调函数中进行的状态的改变都是不可追踪的

## action

action 和 mutation 的区别：

1. Action 提交的是 mutation，而不是直接变更状态
2. Action 可以包含任意异步操作

### 通过 dispatch 调用 action

`store.dispatch('increment')`

## Module

> Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割

## vuex 刷新后状态就重置了

vuex 刷新后状态的确都会被重置掉，所以我们需要把 vuex 的值存储到本地缓存中。

使用插件：`vuex-persistedstate` 这样 vuex 值同步更新的时候，都能及时更新到本地缓存中，刷新后也会从本地缓存中重新取值
