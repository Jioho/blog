# 分析源码系列 - Vue.set / `vm.$set` 详解

[[toc]]

## 作用和概念描述

[官方文档：Vue-set](https://cn.vuejs.org/v2/api/#Vue-set)

::: tip 作用

向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，**因为 Vue 无法探测普通的新增 property (比如 this.myObject.newProperty = 'hi')**

:::

::: warning 局限性

不允许动态添加根级响应式属性。比如：

```js
// 错误写法
this.$set(this, 'newkey', 1111)

// 正确写法
this.$set(this.obj, 'newkey', 111)

// 取值： this.obj.newkey => 111
```

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628151402.png)

:::

### 小结

- `Vue.set` 和 `vm.$set` 方法其实都是同一个，只是写法上不太一样
- 效果都是为页面动态添加属性，并且动态添加的属性也是响应式的属性

## 为什么用过 set 添加的就是响应式属性

先看下 vue 响应式原理：[vue 双向数据绑定原理](/Vue/vue双向数据绑定原理.md)  
可以看到响应式其实依赖于一个 `Object.defineProperty`  
而 `Object.defineProperty`只监听某个对象下的一个属性，如果有多个属性需要分别监听

看个 demo 理解下：

```js
var data = {}

Object.defineProperty(data, 'data1', {
  get: function() {
    console.log('get data1')
    return this.value
  },
  set: function(newVal) {
    console.log('set data1')
    this.value = newVal
  }
})

data.data1 = 111 // 将会打印 set data1
console.log(data.data1) // 先打印 get data1  然后才是 111

data.data2 = 222 // 无打印，无报错
console.log(data.data2) // 直接打印222。表示没有进过 `Object.defineProperty`
```

## 开始看源码

来一个调试的 demo

```html {10,11}
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<script>
  var app = new Vue({
    el: '#app',
    data: {
      addData: {}
    }
  })
  debugger
  app.$set(app.addData, 'newkey', 1111)
</script>
```

第一个进入 `$set` 方法的时候，默认先来到了取值部分，这时候 return 了一个空值，在 return 后，再次进入 `$set` 才是我们需要调试的部分
![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628160948.png)

### 调试模式下，进入 set 方法

::: details 1081 行 2 个方法用于检测目标节点的数据类型，也就是 `$set` 的第一个参数的检测。 展开查看相关检测方法

```js
function isUndef(v) {
  return v === undefined || v === null
}

/**
 * Check if value is primitive.
 */
function isPrimitive(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

:::

- 1085 - 1089 判断的是数组类型，毕竟由于特殊的类型`Object.defindPropety`无法检测数组的变化，所以数组变化是手动更新的。
- 1090 - 1093 便是判断属性是否原先就已经存在了，存在就没必要重复监听了
- 1095 - 1100 就是判断不能在根节点 `this.data` 直接去添加数据了
- 注意 1094 行变量 `ob` 就是 observed(观察者) 的简称。也是用于判断该变量是否已经被监听过了
- 监听过无须重复重复监听的值都会直接返回对应的 `val`。这也是 `$set` 返回当前值的一个 return
- 如果是新增的对象，那就走到了 1106 行 `defineReactive$$1` 方法中

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628161129.png)

<!-- ![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628154000.png) -->

### 添加监听 `defineReactive$$1` 方法

- 1021 行 初始化 `new Dep` [查看 dep 的分析](#dep-分析) 看 dep 分析还是很有必要的。这涉及后面许多的流程
- 1023 - 1026 判断该对象是否可读写
- 1019 - 1033 获取目标对象上的 `get` 和 `set` 方法.
- 1035 有个 shallow 变量，在我们前面的代码中这个变量是不存在的 `!shallow` 即为 true。所以执行了 `observe` 方法 [查看 observe 分析](#observe-分析)
- 看完上面的 `observe` 分析 我们知道了 `observe` 就是为他的子属性，循环添加监听的。
- 1039 行 绑定了获取属性值的事件，在获取对应的值的时候， `Dep.target` 刚才也看到了，是一个全局的观察者`watch`。那如果存在 `dep.target` 为当前的对象调用一个 `depend` 方法，这个方法是从 `Dep` 继承过来的。相当于也是为 watch 注册一个回调事件把（这估计是为 `watch` 和 `computed` 埋下的一个伏笔）
- 1052 行开始 `set` 方法 。也是先从自身的 `getter` 里面获取当前的值
- 1069 行，如果我们新复制的是一个对象，他还得循环重新为这些对象添加一个数据挟持，如果已经挟持过的就可以跳过，也就是上面的代码了
- 最后 1070 行，set 后，调用了 `dep.notify()`。这里面存储对应对象更新需要触发的时间(订阅观察者模式)。既然值更新了，就触发给相关的订阅函数 **(watch 也是这时候触发了，视图也是这时候更新了)**。而且我们前面有拿到 set 之前的值，所以 `watch` 方法里面`newVal`和`oldVal`就是这时候被记录下来的
- 最终就返回当前的值，`$set` 方法也就执行结束了

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628162522.png)
![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628162544.png)

---

### dep 分析

dep 代码不是很长。dep 就相当于是一个订阅中心

- 717 行 可以看到每一个 dep 都有对应的 ID，并且自增的
- 718 行可以看做是一个事件中心，所有的监听都存储到了这里
- 可以看到 dep 原型上有几个方法 `addSub` `removeSub` `depend` `notify`。都是用于操作对应的监听，添加/删除，找到对应的依赖，通知这几个方法
- 725 行 `Dep.target` 有非常详细的注释，全局唯一的观察者

**最核心的就是记住几个 `addSub` `removeSub` `depend` `notify` 方法。然后接着刚才的代码继续看**

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628163227.png)

### observe 分析

尤大贴心的注释

> Attempt to create an observer instance for a value,  
> 尝试为值创建观察者实例  
> returns the new observer if successfully observed,  
> 如果成功观察到，则返回新的观察者  
> or the existing observer if the value already has one.  
> 或现有的观察者（如果值已包含一个）

- 看来 `value.__ob__` 如果存在，那这个属性就已经有观察者了，这也是我们 `$set` 第一步中的一个判断，判断 `__ob__`的
- 然后区分了数组的，数组并没有观察者
- 主要看 1003 行，创建一个新的观察者 `new Observe` 注意是大写的，不是当前的对象了

- `new Observe` 在下面图二，就不分开讲了
- 926 行。为`__ob__` 添加属性，不要搞错了，并且把`__ob__`设置为不可枚举类型。具体可以看下 926 行进去的代码
- 927-933 都是为数组的操作了
- 935 行，当前对象的 walk 方法。直接贴上代码，可以看到是一个循环，把我们的对象遍历了一次，并且为每个对象都调用了 `defineReactive$$1` 。可以看到备注，只有值是对象类型，才会调用这个方法。
- 既然调用了 `defineReactive$$1` 。那这里就形成了一个递归，递归的头部，就是当属性，不再是对象的时候，就停止调用 `defineReactive$$1`。
- 看到这里之后，下一步应该回到 [添加监听 defineReactive\$\$1 方法](#添加监听-definereactive-1-方法) 的 第 1035 行

```js {9}
/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj)
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i])
  }
}
```

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628164723.png)

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200628180231.png)

## 总结

- vue 响应式原理依赖于 `Object.defindPropety`的 `get` 和 `set` 方法，分别在这 2 个方法去触发对应的事件

- 由于 JS 和 `Object.defindPropety`的限制，以至于不能动态添加需要监听的属性，所以就要用到 `Vue.set()`方法

- `Vue.set()` 方法内部是一个循环处理的过程，如果当前新增监听的是一个对象，那就继续调用自己形成一个递归，直到最后的**子属性**是一个`数组/非对象类型`的参数后，递归结束，然后为自己添加监听，在监听中又会触发其他相关的方法(Dep 中订阅的事件就会被触发)。形成我们常见的双向数据绑定

- 由于 `Object.defindPropety` 只能监听对象的变化，所以对于数组内某一个索引的值发生改变也是不能监听到的，于是还要用到`Vue.set` 手动去触发更新，这时候的`Vue.set`只会做值的更新，而不会重复新增监听
