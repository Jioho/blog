# 判断数据类型 typeof 和 instanceof

判断方式：
[[toc]]

## 1. typeof

- `typeof` 对于基本类型，除了 `null` 都可以显示正确的类型
- `typeof` 对于对象，除了函数都会显示 `object`
- 主要用于判断数据是不是基本数据类型：`String`、`Number`、`Object`、`Null`、`Undefined`，但是无法判断出 function（有些浏览器会出错）、array、regExp

```js
console.log(typeof '') // string
console.log(typeof []) // object
console.log(typeof {}) // object
console.log(typeof 1) // number
console.log(typeof null) // object
console.log(typeof undefined) // undefined
console.log(typeof true) // boolean
console.log(typeof function() {}) // function
console.log(typeof /\d/) // object
```

## 2. instanceof

- 主要的目的是用来检测`引用类型`，判断 `Array` 和 `RegExp`，无法准确判断 Function
- `A对象 instanceof B对象` : 判断 A 对象原型链上 是否有 B 对象原型 ！！！
- `instanceof` 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`

```js
console.log([] instanceof Array) //true
console.log({} instanceof Object) //true
console.log(/\d/ instanceof RegExp) //true
console.log(function() {} instanceof Object) //true
console.log(function() {} instanceof Function) //true

console.log('' instanceof String) //false
console.log(1 instanceof Number) //false
```

## 3. Object.prototype.toString

这是对象的一个原生原型扩展函数，用来精确的区分数据类型

```js
var type = Object.prototype.toString
console.log(type.call('')) // [object String]
console.log(type.call([])) // [object Array]
console.log(type.call({})) // [object Object]
console.log(type.call(false)) // [object Boolean]
console.log(type.call(null)) // [object Null]
console.log(type.call(undefined)) // [object Undefined]
console.log(type.call(function() {})) // [object Function]
```

## instanceof 详解

上面只是简单的介绍了下 instanceof。接下来深入了解一下这个运算符

看个简单的 demo。如果对上面的内容已经熟悉，并且[原型和原型链](/JavaScript/原型和原型链.html)，[原型继承](/JavaScript/继承的几种方式.html)也有一定了解的，看下面这段代码一定一点都不吃力

```js
// 判断 foo 是否是 Foo 类的实例 , 并且是否是其父类型的实例
function Aoo() {}
function Foo() {}
Foo.prototype = new Aoo() //JavaScript 原型继承

var foo = new Foo()
console.log(foo instanceof Foo) //true
console.log(foo instanceof Aoo) //true
```

来一个复杂的

```js
function Foo() {}
console.log(Object instanceof Object) // 01
console.log(Function instanceof Function) // 02
console.log(Number instanceof Number) // 03
console.log(String instanceof String) // 04

console.log(Function instanceof Object) // 05

console.log(Foo instanceof Function) // 06
console.log(Foo instanceof Foo) // 07
```

::: details 查看答案

| 编号 |  01  |  02  |  03   |  04   |  05  |  06  |  07   |
| :--: | :--: | :--: | :---: | :---: | :--: | :--: | :---: |
| 答案 | true | true | false | false | true | true | false |

- 为什么 Object 和 Function instanceof 自己等于 true，而其他类 instanceof 自己却又不等于 true 呢？

要想知道这个答案，自己写一个 instanceof 了解下原理

:::

### 自己实现一个 instanceof

- 我们都知道，instanceof 是根据原型链，判断当前对象的原型链是否存在需要判断的对象
- 原型链是一直找下去的，所以我们得有一个不断循环根据原型链找上级原型的的方法`（while(true)就很合适）`
- 总不可能一直找下去，原型链顶端就是 `null`，如果找到顶端都还没找到，那就是结束了

于是写出这样的代码:

```js
/**
 * L 表左表达式   即L为变量
 * R 表示右表达式 R为类型
 */
function my_instance_of(L, R) {
  let RP = R.prototype // 取右表达式的 prototype 值
  L = L.__proto__ // 取左表达式的__proto__值
  while (true) {
    if (L === null) {
      return false
    }
    if (L === RP) {
      return true
    }
    L = L.__proto__
  }
}
```

### 解释下 为什么 Object 和 Function instanceof 等于自己

根据上面推导出来的 `my_instance_of` 方法，我们把 `Object` 套进去看一看效果

```js
my_instance_of(Object, Object) // true
```

**步骤分析**

1. 传入了 2 个 `Object`。也就是说 `L` 和 `R` 都是 `Object`
2. RP = Object.prototype
3. L = `Object.__proto__`
4. 第一轮对比 `Object.__proto__ !== Object.prototype` 2 个不相等
5. L 重新赋值为 `Object.__proto__.__proto__` **重点来了** `Object.__proto__` 和 `Function.prototype` **是相等的！**。所以这时候的 `L === Object.__proto__.__proto__ === Function.prototype.__proto__`
6. 重新进入 while，根据 5 的推导，`Function.prototype.__proto__ === Object.prototype` 为 true！
7. 返回，Object instanceOf Object 比较结果为 true

---

**~~我怀疑你在凭空想象~~：为什么 `Object.__proto__` 和 `Function.prototype` 是相等的？？**

先看基础: [内置对象(函数对象)和普通对象区别](/Javascript/内置对象和普通对象.html)

> 内置对象概念：js 已经创建好了，你不用自己再创建的对象（免去 new 的步骤），直接就可以调用

**发现 `Object` 是函数对象**。函数对象的原型链指向函数(Function)的原型，有问题吗？没有问题！

所以 instanceOf 的对比是没错的。`Function instaceOf Function` 同理:

1. RP = Function.prototype
2. L = `Function.__proto__`
3. L === RP 成立。因为 `Function` 也是函数对象，函数对象的原型链指向 Function 的原型

### 得出一个小结论

- `内置对象（函数对象）` 用 instaceOf Function 肯定会返回 ture
- instaceOf 会不断根据原型链往上查找，最终找到 null 停止
