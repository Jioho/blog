# Vue 组件 data 为什么必须是函数

::: tip 教科书般的解释(官网原话)

当一个组件被定义，data 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。如果 data 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象

:::

👆 注意不要囫囵吞枣，感受下下面 2 句话：

- 是`组件`为什么必须是函数
- 组件可被创建多个实例

> 很长一段时间我都理解为：~~为什么 vue 的 data 需要函数返回~~，那我们直接引入 JS 使用的时候，`new Vue`也没见的一定要函数返回啊。直到今天才发现是理解少了几个字，**vue 创建的组件的 data 才需要函数返回**

不想看分析的直接看这里

::: tip 问题分析总结

`new Vue` 可以不使用函数返回的原因在于，每次`new`的时候，传入的都是新的对象（新的内存地址）。所以修改其中一个 vue 实例并不会影响其他实例

对于组件而言，组件定义好之后是有默认值 **（我们把一个组件引入后，修改了部分值后。再次引入相同的组件时，第二次引入的组件初始值还是保持原来设置的）** 所以在组件注册（vue 的一个内部流程）的时候，vue 会把这个组件**传入的配置存下来**，多次生成同一个组件的时候都会**从存下来的配置中取值**，然后通过`new`创建新的组件实例。可如果这时候 data 为对象 **（引用类型的内存地址是一样的）** ，那每次生成新的组件实例的 data 都指向了**同一个内存区域**，这时候其中一个同类型组件值更新了。其余的都会跟着一起更新

要解决上述说的组件的问题，就需要用函数的形式，每次创建组件都通过 function 返回一个**新的对象（内存地址不一样的对象）**。这样组件的 data 才是自己单独的

:::

## 要理解这个问题，得从原型说起

不熟看这里 👉 [原型和原型链-基础,但是非常重要](../02.JavaScript/原型和原型链.html)

### 3 个栗子 理解后在看源码

**1. 案例 1：**

```js {2,7,8,9}
function Animal() {}
Animal.prototype.data = { name: '宠物店', address: '广州' }
var dog = new Animal()
var cat = new Animal()
console.log(dog.data.address) // 广州
console.log(cat.data.address) // 广州
dog.data.address = '东莞'
console.log(cat.data.address) // 东莞
dog.data === cat.data // true
```

::: tip 第一个小结论

dog 和 cat 的原型都是 Animal。自然会继承原型的属性。继承过来后，`因为 data 是普通对象`，属于`引用数据类型`，所以 dog 和 cat 的 data 其实都指向同一块内存地址

就连严格运算符判断都是相等的，**说明他们值相等，内存地址也相同，修改其中一个将会影响另外一个**
:::

**2. 案例 2：**

```js {2,5,11,12,13,14}
function Animal() {
  this.data = this.data()
}
Animal.prototype.data = function() {
  return { name: '宠物店', address: '广州' }
}
var dog = new Animal()
var cat = new Animal()
console.log(dog.data.address) // 广州
console.log(cat.data.address) // 广州
dog.data.address = '东莞'
console.log(cat.data.address) // 广州
console.log(dog.data.address) // 东莞
dog.data === cat.data // false
```

**稍微解释下**：为什么第二行:`this.data = this.data()`

> 我们在执行 new 的过程中，Animal 其实充当了`constructor`。详情可以看 [new 一个对象发生了什么](../02.JavaScript/new一个对象的时候发生了什么.html)。这时候 `this.data` 还是一个函数，还没执行的函数，所以调用一下 this.data()。让函数返回一个值。然后重新赋值给 `this.data`

::: tip 结论 2
用了 function 后，data 都被锁定在当前 function 的作用域中，然后被返回出去，**相当于创建了另外一个对象，所以多个实例之间不会相互影响**
:::

**3. 案例 3**

```js {2,4,5,10}
function Animal({ data }) {
  this.data = data
}
var dog = new Animal({ data: { name: '宠物店', address: '广州' } })
var cat = new Animal({ data: { name: '宠物店', address: '广州' } })

console.log(dog.data.address) // 广州
console.log(cat.data.address) // 广州

dog.data === cat.data // false
```

::: tip 结论 3

注意这里的变量声明方式，是直接放在了构造函数中，并不是通过原型链来查找的。这也就是为什么`new Vue`的时候 data 可以为非函数，**在构造函数执行的时候，data 就已经相互隔离**

:::

## 使用 debugger，看下 new vue 发生了什么

**多图预警！！** new Vue 发生了什么!!

关于 `new Vue`，可以看`案例 3`。在 new 的过程中，就已经传入参数赋值

开始 debugger

```html
<!-- 引入vue -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

```js
debugger
// 在 new Vue之前，进入debugger模式
var app = new Vue({
  el: '#app',
  data: { message: 'Hello Vue!' }
})
```

### 1. 走到了初始化 vue 的步骤

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623202450.png)

### 2. 来到 init 方法内部

- 4994 行 我们常见的 vm 对象。其实就是 vue 的 this 对象。(图片截的不够长，往上一点能看到 vm = this)
- 4998 我们常说的生命周期第一步 `beforeCreate`
- 5000 这是我们今天要深究的函数：`initState` 初始化 data 对象的
- 5002 生命周期第二步 `create`

> 验证了 vue 生命周期的一个知识点：beforeCreate 还不能拿到 this.data。需要在 create 的时候才能拿到

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623202707.png)

### 3. 来到 initState 方法

- 可以看到初始化`props`、初始化`methods`。然后才到初始化 `data`。如果没有 data 还会给个默认值`{}`
- 初始化 `data` 后开始处理 `computed`。然后挂载 `watch`
- 主题是研究 `data` 。继续进入到 `initData` 函数里面

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623203322.png)

### 4. initData 方法

```js
data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
```

- 可以看到是有判断，如果传入的是函数，就调用该函数(`getData方法里面就是调用函数返回对象的`)。如果不是函数就默认拿 data，否则还是个默认值。
- 接下来的步骤就是开始做一些代理，数据挟持的监听`proxy`、`observer` 之类的 ~~不在我们 data 讨论范畴了~~。下次在分析

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623203657.png)

### 小结

::: tip new vue 小结

new Vue 的过程和案例 3 是非常相似的，只是单纯的传入对象，然后使用 new 的特性，给 `vm._data` 对象赋值，其实也就是为当前的 vue 实例的 data 赋值，由于 new 的特性在，所以 data 不强求函数返回，当然也可以函数返回

:::

## new Vue 的源码简单的看下。那继续看今天主角 `components` 的实现

`components` 作为一个组件类型，只是一个简单的工厂模式（一开始的组件参数都是定好的，需要就创建一个新的组件，简称工厂模式），创建很多的组件实例。就像`案例 1` 一样

还是先写一个 debugger 进入源码

**日常多图预警！！**

```html
<!-- 引入vue -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

```js
// 在 new Vue之前，进入debugger模式
debugger
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function() {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

### 1. 进入到了 initAssetRegisters 初始化登记注册（组件注册）

- 5225 行。判断要注册的是一个 `component` 组件
- 5232 行。判断要注册的是 `directive` 指令。注册事件都的确在 `initAssetRegisters`中。
- 5226 行 `validateComponentName` 验证组件名称是否被占用
- 5229 是判断组件是否有定义的名称，没有就用自己组件的标签。这是为了 上一步，验证组件是否已经生成的。
- 5230 `this.options._base.extend(definition)` 有这么一段代码，下一步就到这里面看看

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623204932.png)

### 2. extend 函数中

- `this.options._base` 其实就是下图中的 Vue。调用 `Vue.extend`
- 留意看 5146-5148 行。**我在 5147 打了断点。后续的步骤会回到这里**
- 这一路执行下来。生成了一个`Sub`对象。
- 5149-5155 行。就是准备一个 `new` 的过程。

```js
Sub.prototype = Object.create(Super.prototype) // 构造器原型
Sub.prototype.constructor = Sub // 构造函数等于Sub方法。在new的时候就会执行Sub里面的内容
Sub.cid = cid++
Sub.options = mergeOptions(Super.options, extendOptions) // 合并参数等
```

- 5192 行。把 `Sub` 对象 return 了回去。那就是回到了 `initAssetRegisters` 函数那边去了
- 回去后，把 `Sub` 赋值给了`definition` 对象（第一步的 5230 行）
- 接着 definition 也被返回出去了。其中这一个返回被一个函数包裹着。函数被赋值为 `Vue[type]`(第一步的 5217 行接收了)这时候 type 是`component`。相当于 调用 `Vue.component` 的话，返回值就是`Sub`
- **重点：** 5152 行和 5154 行中。Sub.options 合并了 2 个对象，分别是 `Super.options(应该是父组件的一些参数了)`。第二个就是合并了自己的参数，**其中 data 就在 5154 行中**。后面的步骤还会说这个 `options`

有点长，分开 2 张图

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623205840.png)
![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623205901.png)

### 3. 想办法进入 init 方法看看

因为在步骤 2 中我们留了个断点，而一开始创建组件的方式是全局创建的。可能很多步骤没有看到，把代码改一改，改成局部组件，在 debugger 一下

代码改成这样子，因为之前留有断点，所以就无须 debugger 了，刷新即可直接到我们定好的断点里面去：

```js
var ComponentA = {
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
  data() {
    return { count: 0 }
  }
}
var app = new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA
  }
})
```

能回到 `Sub` 里面。说明我们之前摸索的步骤被调用了。Sub 方法被调用，才会执行到`init`。那我们在 init。返回上一步，看下是谁调用的。

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623212401.png)

看来这一步就是开始 new 一个新的组件。所以触发到了 init 方法

这次进来总算看到有下一步的函数
![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623211712.png)

### 4. 进入组件的 init 方法中

- 特别熟悉的感觉。没错！就是 `new Vue` 那个过程！毕竟组件也有自己的生命周期，参数，子组件，所以又回到了这里
- 那 `initState` - `initData` 的过程我就不重复。不清楚的可以再看上面 `new Vue`的过程。

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623211820.png)

### 5. 组件的 data 在 `initData` 中的作用

这里开始绕了。思路要清晰

- 回想步骤 2 extend 函数中 5152 行。和 5154 行。是不是存储了组件的 `options`。

- 那在下图的 `4700` 行中。vm 就是当前的组件。他的`options`就是来自组件注册时，生成的`Sub`对象

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623213443.png)

### 6. 这时候抽象出来一些代码

- Sub.options 是组件注册的时候就开始有值了。所以我们也给个默认值演示
- Sub.prototype.init 估计是后期赋值，赋值为创建 vue 的生命周期的函数。所以我们也给他来一个简化版的函数，只模拟赋值 this.data 的过程，看一下效果

```js
var Sub = function() {
  this.init()
}
Sub.prototype = {}
Sub.prototype.constructor = Sub
Sub.prototype.init = function() {
  this.data = typeof Sub.options.data === 'function' ? Sub.options.data() : Sub.options.data
}
Sub.options = {} // 等下会给默认值
```

### 7. 根据抽象出来的代码，模拟 new 几个组件

**第一次尝试用的是 data 对象形式：**

::: tip 原理和最上面的`案例 1` 一样

因为 data 是引用类型。并且一开始 Sub.options 就是有值的，在创建新组件的时候拿的都是同一个地方的值

:::

```js
// 上面也说了。先给sub.options来个默认值。模拟传入的参数
Sub.options = {
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
  data: {
    count: 0
  }
}

// 结合步骤6的代码。创建3个组件
var component1 = new Sub()
var component2 = new Sub()
var component3 = new Sub()

console.log(component1) // {data:{count:0}}
console.log(component2) // {data:{count:0}}
console.log(component2) // {data:{count:0}}

// 看着好像没啥问题？我们来修改一个组件的值
component1.data.count = 1

// 传说中的组件中值会相互影响情况出现了
console.log(component1) // {data:{count:1}}
console.log(component2) // {data:{count:1}}
console.log(component3) // {data:{count:1}}
```

**如果改成函数的形式呢？**

::: tip 原理和`案例 2` 一样。

虽然这时候 Sub.options 拿到也是同一个地方的值。可是 Sub.options.data 已经是函数类型，而不是引用类型。函数执行后，返回的值都是不用堆内存的地址，所以修改某一个`Sub实例（组件的值）`其余的组件都不会受到影响

:::

```js
// 上面也说了。先给sub.options来个默认值。模拟传入的参数
Sub.options = {
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
  data() {
    return {
      count: 0
    }
  }
}

// 结合步骤6的代码。创建3个组件
var component1 = new Sub()
var component2 = new Sub()
var component3 = new Sub()

console.log(component1) // {data:{count:0}}
console.log(component2) // {data:{count:0}}
console.log(component3) // {data:{count:0}}

component1.data.count = 2
// 现在就不会互相影响了
console.log(component1) // {data:{count:2}}
console.log(component2) // {data:{count:0}}
console.log(component2) // {data:{count:0}}
```

### 8. 最后总结一下 demo

可以自己试着改一改。跑一跑

```js
var Sub = function() {
  this.init()
}
Sub.prototype = {}
Sub.prototype.constructor = Sub
Sub.prototype.init = function() {
  this.data = typeof Sub.options.data === 'function' ? Sub.options.data() : Sub.options.data
}
Sub.options = {
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
  data() {
    return {
      count: 0
    }
  }
}

// 结合步骤6的代码。创建3个组件
var component1 = new Sub()
var component2 = new Sub()
var component3 = new Sub()

console.log(component1) // {data:{count:0}}
console.log(component2) // {data:{count:0}}
console.log(component3) // {data:{count:0}}

component1.data.count = 2
// 现在就不会互相影响了
console.log(component1) // {data:{count:2}}
console.log(component2) // {data:{count:0}}
console.log(component2) // {data:{count:0}}
```
