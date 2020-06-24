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
