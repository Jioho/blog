# JS 事件循环机制(event loop)之宏任务/微任务

::: tip 先说点基础

1. JavaScript 是单线程的语言
2. Event Loop 是 javascript 的执行机制

:::

## javascript 事件循环

JS 是单线程语言，意思就是同一时刻内只能执行一个任务。就好像排队，必须一个个接着来。如果上一个任务执行时间过久，那下一个任务也必须等着

那这就可能会出现问题。如果加载一个商品列表页的图片，我们必须等图片加载完才能继续加载后续的内容，整个页面都会停顿在哪里，这是绝对不允许的事情

于是出现了：`同步任务`、`异步任务`：

- 常见的`同步任务`：网页的渲染过程就是一大堆同步任务（因为 JS 也可以修改 dom。防止 JS 和 html 的渲染流程冲突）。普通的 JS 也是同步任务，因为 JS 都是一行一行执行的，上一行代码没执行完，下一行便不会执行，不过也有例外，后面会说到
- 常见的`异步任务`：ajax 请求、加载资源等耗时的任务

***看一段代码**

```js
console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

Promise.resolve()
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

::: details 查看运行结果
script start -> script end -> promise1 -> promise2 -> setTimeout

`script end` 居然在第二位？没想到吧

`setTimeout` 的延迟是 0S。为什么还是最后才执行？？

`Promise` 这时候到底算是同步方法还是异步方法？
:::

来看一张图
![](https://gitee.com/Jioho/img/raw/master/knowledge/logo/20200612213711.png)

- 同步和异步任务分别进入不同的执行`场所`，同步的进入主线程，异步的进入 Event Table 并注册函数
- 当指定的事情完成时，Event Table 会将这个函数移入 Event Queue。
- 主线程内的任务执行完毕为空，会去 Event Queue 读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的 Event Loop(`事件循环`)。

> （图和解读出处：
> 作者：张倩 qianniuer
> 链接：[https://juejin.im/post/5b498d245188251b193d4059](https://juejin.im/post/5b498d245188251b193d4059)
> 来源：掘金）

## 宏任务和微任务还有 ajax

> 同步任务很好理解。异步任务也没问题，注册回调事件嘛，我们经常这么做的。
>
> 上面代码中还有一个坑没说明，`setTimeOut` 和 `Promise`到底算怎么回事？这就要引出下面的：**宏任务（task）**，**微任务（Microtasks）**

- 宏任务：包括整体代码 script，setTimeout，setInterval、setImmediate。

- 微任务：原生 Promise(有些实现的 promise 将 then 方法放到了宏任务中)、process.nextTick、Object.observe(已废弃)、 MutationObserver 记住就行了

- ajax 请求：`ajax 请求不属于宏任务`，js 线程遇到 ajax 请求，会将请求交给对应的 `http 线程`处理，一旦请求返回结果，就会`将对应的回调放入宏任务队列`，等请求完成执行。

- process.nextTick：`node` 中一个很重要的对象。在代码执行的过程中可以随时插入 `nextTick`，并且会保证在下一个`宏任务开始之前所执行`。

> - 在一个事件循环中，**异步事件返回结果后会被放到一个任务队列中**。然而，根据这个异步事件的类型，这个事件实际上会被对应的`宏任务队列`或者`微任务队列`中去。并且在当前执行栈为空的时候，主线程会 查看微任务队列是否有事件存在。如果不存在，那么再去宏任务队列中取出一个事件并把对应的回到加入当前执行栈；如果存在，则会依次执行队列中事件对应的回调，直到微任务队列为空，然后去宏任务队列中取出最前面的一个事件，把对应的回调加入当前执行栈…如此反复，进入循环。
>
> - 我们只需记住当当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，**微任务永远在宏任务之前执行**。
>
> - 在当前的微任务没有执行完成时，是不会执行下一个宏任务的。

所以知道为啥 Promise 比 setTimeOut 先执行了把

## 总结一下：

- 宏任务按顺序执行，且浏览器在每个宏任务之间渲染页面
- 所有微任务也按顺序执行，且在以下场景（下一次宏任务之前）会立即执行所有微任务
  - 每个回调之后且 js 执行栈中为空。
  - 每个宏任务结束后。

## 最后来一段代码，检验下理解程度

```js
console.log('1')

setTimeout(function() {
  console.log('2')
  process.nextTick(function() {
    console.log('3')
  })
  new Promise(function(resolve) {
    console.log('4')
    resolve()
  }).then(function() {
    console.log('5')
  })
})
process.nextTick(function() {
  console.log('6')
})
new Promise(function(resolve) {
  console.log('7')
  resolve()
}).then(function() {
  console.log('8')
})

setTimeout(function() {
  console.log('9')
  process.nextTick(function() {
    console.log('10')
  })
  new Promise(function(resolve) {
    console.log('11')
    resolve()
  }).then(function() {
    console.log('12')
  })
})
```

::: details 查看结果
共进行了三次事件循环,完整输出为：
`1，7，6，8，2，4，3，5，9，11，10，12`

(请注意，node 环境下的事件监听依赖 libuv 与前端环境不完全相同，输出顺序可能会有误差)
:::

::: details 查看 3 次循环分析

> 第一轮

1.1. 整体的 script 进入主线程，遇到 console 1

1.2. 遇到了第一个 setTimeOut -> 分发到 `宏任务` Event Queue 中(标记为 setTimeOut1)

1.3. 遇到 process.nextTick() -> 分发到 `微任务` 中（标记为 process1）

1.4. 遇到 promise。promise 中的方法直接执行，所以会输出 7。然后进入了 `then` 回调 -> 分发到 `微任务` 中(标记为 `then1` )

1.5. 再次执行 setTimeOut。-> 分发到 `宏任务` 中。标记为(setTimeOut2)

这时候 宏任务有 2 个，微任务也有 2 个

|   宏任务    |  微任务  |
| :---------: | :------: |
| setTimeOut1 | process1 |
| setTimeOut2 |  then1   |

此时主线程已经打印了`1,7`。然后先执行所有的微任务。`process1` -> `then1`

第一轮执行结果：`1,7,6,8`

> 第二轮

第二轮时间循环从 setTimeout1 宏任务开始：

2.1 setTimeOut1 开始执行，遇到 consoole.log(2) 打印了出来

2.2 遇到了 process.nextTick -> 分发到 `微任务`(标记为 process2)

2.3 执行 Promise。其中 function 立刻执行，所以打印了 4.执行了 resolve。进入 `then` 回调，这时候 then 回调 分发到 `微任务`(标记为 then2)

这时候 setTimeOut1 已经被执行完。宏任务就剩下了 setTimeOut2.然后新增了 2 个微任务。

在执行 setTimeOut2 之前会把 2 个微任务执行完

|   宏任务    |  微任务  |
| :---------: | :------: |
| setTimeOut2 | process2 |
|             |  then2   |

所以第二轮打印的是：`2 , 4 , 3 , 5`

> 第三轮

接着执行 setTimeOut2。原理和第二轮一样。所以输出 `9，11，10，12`

拼起来就是：`1，7，6，8，2，4，3，5，9，11，10，12`

:::
