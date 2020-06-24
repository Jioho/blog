# vue 生命周期的理解

总共分为 8 个阶段创建前/后，载入前/后，更新前/后，销毁前/后
[[toc]]

## beforeCreate 创建前

创建前执行（vue 实例的挂载元素\$el 和数据对象 data 都为 undefined，还未初始化）

```js
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

**initState:**

- 作用：初始化 `props`、`data`、`methods`、`watch`、`computed` 等属性
- 限制：beforeCreate 不能获取到 props，也不能调用 methods 的函数。也不能访问 DOM 因为并没有渲染 DOM
- 提示：要使用以上的 props,data,methods,Dom 等要等到 `created`

## created 完成创建

完成创建 （完成了 `data` 数据初始化，el 还未初始化）
这时候可以访问方法和 data。请求也可以放在这里开始执行

**这时候只是初始化了 watcht 属性，可是 watch 还不能用**

## beforeMount 挂载前

载入前（vue 实例的\$el 和 data 都初始化了，但还是挂载之前为虚拟的 dom 节点）

- 作用：
  - beforeMount 开始渲染虚拟 dom
  - 这时候会执行一个 `new Watcher` 用来监听数据更新的
  - mounted 钩子函数的执行顺序也是先子后父（子组件的 mounted 先执行，在渲染父组件的 mounted 方法）。

## mounted 挂载完成

载入后 html 已经渲染(vue 实例挂载完成。页面渲染完成)

`【重点】`watch 的挂载是在 `beforeMounted` 的时候，而实际可以监听则是在 `mounted` 之后

## beforeUpdate 更新前

更新前状态（view 层的数据变化前，不是 data 中的数据改变前）

```js
export function mountComponent(vm: Component, el: ?Element, hydrating?: boolean): Component {
  // ...
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted) {
          callHook(vm, 'beforeUpdate')
        }
      }
    },
    true /* isRenderWatcher */
  )
}
```

- 作用：监听更新数据
- 提示：
  - beforeUpdate 的执行时机是在渲染 Watcher 的 before 函数中
  - 有个判断 `必须在组件挂载后才会执行这个方法`

## updated 更新完成

更新状态后

## beforeDestroy 销毁前

销毁前

- 作用：
  销毁组件 从 parent 的 `$children` 中删掉自身，删除 `watcher`
- 提示：
  销毁自己的时候又会触发子组件的销毁，所以 `destroy` 钩子函数执行顺序是`先子后父`，和 mounted 过程一样

## destroyed 销毁完成

销毁后 （在执行 destroy 方法后，对 data 的改变不会再触发周期函数，说明此时 vue 实例已经解除了事件监听以及和 dom 的绑定，但是 dom 结构依然存在）

## vue 生命周期图

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200615232700.png)
