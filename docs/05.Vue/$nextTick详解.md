# \$nextTick 详解

官方文档：[异步更新队列](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)

## 为什么要用异步队列

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。

> 官方原话：Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替

我们可以看个例子：

```html
<template>
  <div>
    <p>{{ a }}</p>
    <p>{{ b }}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        a: 'a',
        b: 'b'
      }
    },
    mounted() {
      this.a = 'a1'
      this.b = 'b1'
    }
  }
</script>
```

这里我们在 `mounted` 生命周期中，重新为 2 个变量赋值，根据响应式原理，数据重新赋值，是需要引起 dom 的变化的。

**那是不是我们赋值 2 次，dom 就得更新 2 次？**

显然不行，这太浪费了，就算是虚拟 dom。也是基于`diff`算法。尤其是这种连续更新的值，肯定是在一轮数据更新后才去更新视图。

**新问题来了，vue 怎么知道我们这一轮数据赋值完了呢？**

原理在`Promise.then、MutationObserver 和 setImmediate。` 或者 `setTimeout(fn, 0)`

关于 `setTimeout(fn, 0)` 或者其他异步队列不太了解的可以回顾下： [JS 事件循环机制(event loop)之宏任务/微任务](../02.JavaScript/JS事件循环机制宏任务微任务.html)

由于浏览器的事件循环机制和宏任务，微任务的机制，可以让 setTimeOut 之类的宏任务在一个函数中最后才开始执行 **（意思就是能把我们同一个函数中的 JS 代码都执行完，更新事件才开始）**

### 小结

- 异步队列是为了 `避免不必要的计算和 DOM 操作` 这是非常重要的
- 异步队列的原理就是浏览器的事件循环机制

## 既然视图更新是异步队列，什么时候才知道更新完成？

这时候 `$nextTick()` 就出场了。当 vue 把视图需要更新的内容计算出来后（diff），进行更新。然后就会回调一个 `$nextTick()` 方法，告诉我们视图更新完成

看一个经典的栗子：

```html {18,19,20,23,24,25,30,31,32,35,36,37}
<template>
  <div>
    <p>{{ a }}</p>
    <p>{{ b }}</p>
    <button @click="reload"></button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        a: 'a',
        b: 'b'
      }
    },
    mounted() {
      this.$nextTick(() => console.log('mounted - 1'))
      setTimeout(() => console.log('timeOut - 1'), 0)
      console.log('update')
      this.a = 'a1'
      this.b = 'b1'
      console.log('update - end')
      setTimeout(() => console.log('timeOut - 2'), 0)
      this.$nextTick(() => console.log('mounted - 2'))
    },

    methods: {
      reload() {
        this.$nextTick(() => console.log('reload - 1'))
        setTimeout(() => console.log('timeOut - 1'), 0)
        console.log('update')
        this.a = 'a1'
        this.b = 'b1'
        console.log('update - end')
        setTimeout(() => console.log('timeOut - 2'), 0)
        this.$nextTick(() => console.log('reload - 2'))
      }
    }
  }
</script>
```

说说打印结果，挂载后和点击后的结果：

::: details 打印结果

- mounted 的结果

  - `update` - `update-end` - `mounted - 1` - `mounted - 2` - `timeOut - 1` - `timeOut - 2`

- 点击后
  - `update` - `update-end` - `reload - 1` - `reload - 2` - `timeOut - 1` - `timeOut - 2`

:::

> 为什么 `$nextTick` 还是比 setTimeOut 快执行，明明 setTimeOut 在\$nextTick 前面

正如官方文档说的。`$nextTick` 是用的 `Promise.then、MutationObserver 和 setImmediate。` 这些在异步队列中又被分为`微任务`， **微任务什么特点？就在下一次宏任务执行之前，微任务都会被执行完**。下一次的`宏任务`是谁？就是 `setTimeOut`

那如果是在低版本浏览器没有 `Promise.then` 。那 vue 就会采用 `setTimeOut` 的方式执行。这时候又得分情况，如果我们自己写的代码 `setTimeOut(()=>{},0)`。也是等 0S。那我们的 setTimeOut 就会先执行，否则就是 vue 的先执行

### 小结

- 可以看到，`update` 总是第一个执行，这完全符合之前说的事件循环机制，就算 `$nextTick`和`setTimeOut`在赋值之前，他们都还是先执行了 `update`

- `$nextTick` 在高版本浏览器用的是微任务回调，所以会比我们的 setTimeOut 快执行，如果低版本浏览器那就在分情况讨论

- 自己写 `setTimeOut(()=>{},0)` 也可以实现 `$nextTick()` 效果 ~~（可以但没必要）~~

- `$nextTick()` 并不是针对视图/值更新才触发，就像上面的代码，a 和 b 在点击按钮的时候并没有修改值，这时候`dom 节点也不会更新`。可是 nextTick 还是回调了，说明只要数据有被 set 到，`不管是否修改，只要被 set`，nextTick 就会被触发

`$nextTick` 涉及到了很多`事件循环`，`宏任务`,`微任务`的概念，不熟的还是要多看 JS 进阶 [JS 事件循环机制(event loop)之宏任务/微任务](../02.JavaScript/JS事件循环机制宏任务微任务.html)
