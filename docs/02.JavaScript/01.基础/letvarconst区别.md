# let var const 区别

[[toc]]

## 1.作用域

- `let` 作用域被限制在块级中的变量、语句或者表达式
- `var` 作用域限制在其声明位置的上下文中，而非声明变量总是全局的
- `const` 声明创建一个值的只读引用 (即指针)

## 2.变量提升

- `let` 不存在变量提升，存在暂时性死区，咋子赋值之前使用该变量会报错
- `var` 存在变量提升，如果在变量赋值之前使用该变量拿到的值是 undefined
- `const` 不存在变量提示，提前使用变量会报错

::: details 查看变量提升的示例

```js
;(function() {
  console.log(testLet) // Cannot access 'testLet' before initialization
  console.log(testVar) // undefined
  console.log(testConst) // Uncaught ReferenceError: Cannot access 'testConst' before initialization
  let testLet = 'testLet'
  var testVar = 'testVar'
  const testConst = 'testConst'
})()
```

:::

## 3.可变性

  - `let` 变量可以重新赋值
  - `var` 变量可以重新赋值
  - `const` 变量不可变，如果变量是复合类型（对象），改变复合对象中的某一项可以改变

```js
const anthor = { name: 'Jioho' }
anthor = 'Jioho' // Uncaught TypeError: Assignment to constant variable
anthor.name = 'Jioho_chen' // 成功
```

::: tip let、var 、const 使用

1. let 命令不存在变量提升，如果在 let 前使用 var，会导致报错
2. 如果块区中存在 let 和 const 命令，就会形成封闭作用域
3. 不允许重复声明，因此，不能在函数内部重新声明参数

::: details 查看示例

```js
function fn() {
  var _fn = 1
  var _fn = 2
  console.log(_fn) // 2
}

// 报错理由：3 - 不允许重复声明
function fn() {
  // 报错
  let _fn = 1
  let _fn = 2

  // 报错
  const _fn = 1
  const _fn = 2

  // 报错
  let _fn = 1
  var _fn = 2
}

// 报错理由：3 - 不允许重复声明
function fn(name) {
  // 报错
  let name = 'Jioho'
  const name = 'Jioho'

  // 正常访问！
  var name = 'Jioho'

  // 正常访问
  let a = () => {
    let name = 'Jioho'
  }
}

function fn() {
  let name = 'Jioho'
  const anthor = name

  console.log(name, anthor)
}
```

:::
