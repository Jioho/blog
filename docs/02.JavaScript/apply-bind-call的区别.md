# apply call bind 相关

## 三者的区别

1. `call` 和 `apply` 都是为了解决改变 `this` 的指向。作用都是相同的，只是传参的方式不同
2. 除了第一个参数外，`call` 可以接收一个参数列表，`apply` 只接受一个参数数组
3. `bind` 和其他两个方法作用也是一致的，只是该方法会返回一个函数。并不会立刻执行

## 手写 call

- **理一理需求：**
  - 改变 this 指向。默认指向 window
  - 可以接收多个参数
  - 改变 this 请求后执行该方法
  - 所有的方法都挂载这个 `myCall`
- **理一下实现思路：**

  - 对于 `this`。只需要记住，谁调用该方法，this 就指向谁（箭头函数除外），让传入的对象/window 去调用方法即可
  - 接收多参数：`arguments`或者 es6 新语法：`...args`
  - 立刻执行函数，洒洒水了
  - 所有的方法都挂载，那就用到原型链了，挂载在`Function`对象上

- **万事俱备，开始实现：**

```js {5,10}
Function.prototype.myCall = function(context, ...args) {
  // 默认的window对象
  context = context && typeof context === 'object' ? context : window
  // 防止覆盖掉原有属性
  const key = Symbol()
  // 这里的this为需要执行的方法
  context[key] = this
  // 方法执行
  const result = context[key](...args)
  delete context[key]
  return result
}
```

- **总结一下实现**
  - 首先得确保新的指向是一个对象类型`object`。否则默认全都是 window。当然了 typeof null 也是等于 "object"。所以我们还得先用一个判断确保 context 存在
  - `Symbol` 作用：防止属性名的冲突。为什么要这么做？因为我们需要在新的对象上放一个属性，这个属性就是旧的 `this`。可怎么保证新属性不会和 `context` 原有属性冲突呢？那就要用到 `Symbol`
  - 可能对上面的 `context[key] = this` 疑惑。这到底是为何，为啥要在新的 `context` 上放旧的 this 对象？后面会有代码解释原理
  - 执行方法不存在什么问题了~
  - 最后要 `delete` 掉我们新增的属性，毕竟不能影响原先的 `context` 对象

### 小拓展 context[key] = this 是为何？

理解 `context[key] = this` 对整个手写代码实现有非常重要的意义

> 首先万年不变的原理: **谁调用方法，this 就指向谁**  
> 那为何不是`context`去调用对应方法吗？  
> 因为 `context` 上根本就没对应的方法

用一个小例子理解这个问题

```js {16}
let data = {
  key: 1,
  name: 'Jioho',
  say: function() {
    console.log(this.name)
  }
}
function fn() {
  console.log(this.name)
}

data.say() // Jioho
fn() // 打印为空

// 那如果这样：
data.sayfn = fn
data.sayfn() // Jioho
```

- 差距就出现了，只要对应方法在对象里面，方法就能拿到当前的 `this` 实例
- `context[key] = this` 同理。这时候的 `this` 还是原函数的 `this`。原函数中的 this 才有他本身的方法。所以我们直接把整个 this 赋值给 `context`。就类似于上面第 16 行代码一样
- 至于我们一开始 `key` 为什么要 `Symbol`。就是怕重名如果我们第 16 新的属性不叫 `sayfn`。叫 `say`，那么我们后续的操作就会影响到原先的对象的属性，这是绝对不能出现的问题！

## 手写 apply

如果 [手写 call](#手写-call) 理解后 apply 就只是一个传参的问题

其余代码都无需改动，只需要在接收第二个参数的时候是一个数组类型即可

```js {1}
Function.prototype.myApply = function(context, args = []) {
  // 默认的window对象
  context = context && typeof context === 'object' ? context : window
  // 防止覆盖掉原有属性
  const key = Symbol()
  // 这里的this为需要执行的方法
  context[key] = this
  // 方法执行
  const result = context[key](...args)
  delete context[key]
  return result
}
```

## 手写 bind

- **理一理需求：**

  - 改变 this 指向。默认指向 window
  - 调用 bind 之前的参数，可以传入多个
  - 返回的函数中，还可以继续传参。这个场景还是很实用的
  - 所有的方法都挂载这个 `myBind`

- **理一下实现思路：**
  - 改变 this 指向就无须多说了，不管是手写实现，还是用原有的 `apply` 或者 `call` 都行
  - 调用 bind 之前可以传递多个参数，那还是用到 `arguments` 或者 `...args` 统一接收了
  - bind 需要返回一个`函数`。并且新的函数中还可以继续传参，那就要用到闭包了
  - 所有的方法都挂载，那就用到原型链了，挂载在`Function`对象上

```js
Function.prototype.myBind = function(context, ...args) {
  context = context && typeof context === 'object' ? context : window
  const _self = this
  return function(...args2) {
    return _self.apply(context, [...args, ...args2])
  }
}

// 接下来验证一下：
var data = { baseCount: 10 }
function add(num1, num2) {
  return this.baseCount + num1 + num2
}

// 调用方法
var addBind = add.myBind(data, 1)
addBind(2) // 13

// 或者这样写
add.myBind(data, 1)(2) // 13
```

- **总结一下实现**
  - 万年不变的 `context` 实现
  - 由于有 2 次接收多个参数的方法，我们用到的 `...args` 接收的也必定是一个数组了。所以在返回的函数中用 apply 最合适不过了

**不要小看 bind 这看似奇怪的写法，为啥要分 2 次传参？后续讲到复杂的柯里化，就会发现 bind 现在的魅力所在**
