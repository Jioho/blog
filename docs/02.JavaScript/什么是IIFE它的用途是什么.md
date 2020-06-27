# 什么是 IIFE 它的用途是什么

IIFE 的全称是 **Immediately-invoked Function Expression** 立即执行函数表达式

`IIFE` 或`立即调用的函数表达式`是在创建或声明后将被调用或执行的函数。  
创建 IIFE 的语法是，将 function (){}包裹在在括号()内，然后再用另一个括号()调用它，如：`(function(){})()`

::: details 查看创建 IIFE 的方法

```js
;(function() {
  ...
})()

;(function() {
  ...
})()

(function named(params) {
  ...
})()

(() => {})

;(function(global) {
  ...
})(window)

const utility = function() {
  return {
    ...
  }
}
```

:::

## IIFE 作用

### 避免与全局作用域内的其他变量命名冲突或污染全局命名空间

假设一个场景：有一个多列表页面（推荐列表，最新更新列表，热搜列表 等）。然后 3 个列表分别分给 3 个人去写，每个人都需要有一个获取列表数据的方法，假设叫`getList()` 方法。这时候 A、B、C 同时开始写自己的业务逻辑，如果不做作用域隔离，大家很有默契的都起了叫 `getList`方法。那就会造成冲突和方法被覆盖的情况。而且各个列表可能还有自己特有的参数，作用域隔离就非常有必要了。IIFE 这时候就显得特别的方便。

```js
// 程序猿 A
var _fnA = function() {
  return {
    getList() {
      // 获取推荐列表...
    }
  }
}

// 程序猿 B
var _fnB = function() {
  return {
    getList() {
      // 获取更新列表...
    }
  }
}

// 使用时。他们的方法都被隔离在自己的变量中
_fnA.getList() // 获取推荐列表
_fnB.getList() // 获取更新列表
```

### 执行一个不用复用的函数

有这么一个函数，只需要调用一次，而且不能在让程序有其他方法去调用他，就可以再次使用 IIFE

```js
;(function() {
  // 做一些初始化判断
})()
```

## 用 IIFE 解决一个经典的问题

上面的例子可能都很抽象，我们来一个经典的题目: **JS 中创建 10 个 a 标签，点击弹出对应的序号**

```js {1,9}
for (var i = 0; i < 10; i++) {
  ;(function(currentIndex) {
    var a = document.createElement('a')
    a.innerHTML = i
    document.body.appendChild(a)
    a.addEventListener('click', function(e) {
      console.log(currentIndex)
    })
  })(i)
}
```

> 注意这里用的还是 `var` 并非 let。如果用 let 就完全不用那么麻烦。用 var 只是为看出效果
> 用 IIFE。把当前索引都锁定在了当前的作用域
