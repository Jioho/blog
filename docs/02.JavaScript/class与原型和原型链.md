# class 与原型和原型链

## class 的声明和以前声明方式的区别：

es6 新增的 Class 其实也是语法糖，js 底层其实没有 class 的概念的，其实也是`原型继承的封装`。如果原型还不熟，一定要先看[原型和原型链](./原型和原型链.html)

引用 [阮老师 es6 class](https://es6.ruanyifeng.com/#docs/class) 中的一段代码：

**原始的构造函数**

```js
function Point(x, y) {
  this.x = x
  this.y = y
}

Point.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')'
}

var p = new Point(1, 2)
```

**改用`class`来写**

```js
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }
}
```

> 这会和我们之前学习的原型和原型链冲突吗？Point 又是什么类型？

验证一下：

```js
typeof Point // "function"
Point === Point.prototype.constructor // true
Point.__proto__ === Function.prototype // true
Point.prototype.__proto__ === Object.prototype // true
```

重温一下原型和原型链，完全一致

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200614181608.png)

## 类的方法和 prototype 上的方法

构造函数的 `prototype` 属性，在 ES6 的`类`上面继续存在。事实上，类的所有方法都定义在类的 `prototype` 属性上面。

```js
class Point {
  constructor() {
    // ...
  }
  toString() {
    // ...
  }
  toValue() {
    // ...
  }
}

// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {}
}
```

---

**如何为 class 添加方法？**

### 定义方法的相同点：

之前我们为原型添加方法是：

```js
Point.prototype.say = function() {}
```

- 那我们换到 es6 的语法，使用 class 的时候，也可以像以前一样添加方法
- 也可以使用：`Object.assign` 方法，可以很方便地一次向类添加多个方法。

```js
class Point {
  constructor() {
    // ...
  }
}

Object.assign(Point.prototype, {
  toString() {},
  toValue() {}
})
```

### 定义方法的不同点：

原型上的方法`枚举性`

- `类`的**内部所有定义**的方法，都是`不可枚举`的（non-enumerable）
- 注意只是 `内部所有定义的` 才不可枚举，不代表后面动态添加的不可枚举

看个栗子：

```js
class Point {
  constructor(x, y) {}
  // fn1,fn2算是内部定义的方法
  fn1() {}
  fn2() {}
  // ....
}

function Point2(x, y) {}
Point2.prototype = {
  fn1() {},
  fn2() {}
}

console.log(Object.keys(Point.prototype)) // []  因为class的方法不可枚举
console.log(Object.keys(Point2.prototype)) // ['fn1','fn2']

// 【重点】动态为class添加方法
Object.assign(Point.prototype, { fn3() {}, fn4() {} })
console.log(Object.keys(Point.prototype)) // [fn3,fn4]  只有动态添加的可以枚举
```

---

**那是不是我们都不能通过代码来判断存不存在 `fn1` 和 `fn2` 呢？**

可以！使用 `Object.getOwnPropertyNames(Point.prototype)`。可以看到连 constructor 都被打印出来了

```js
// 还是上面的代码
console.log(Object.getOwnPropertyNames(Point.prototype)) // ["constructor", "fn1", "fn2", "fn3", "fn4"]
```

## constructor 方法

> `constructor` 方法是类的默认方法，通过 new 命令生成对象实例时，`自动调用该方法`。一个类必须有 constructor 方法，如果没有显式定义，**一个空的 constructor 方法会被默认添加**。

**`constructor`方法默认返回实例对象（即 this），完全可以指定返回另外一个对象。**

```js
class Foo {
  constructor() {
    return Object.create(null)
  }
}

new Foo() instanceof Foo // false
```

上面代码中，constructor 函数返回一个全新的对象，结果导致实例对象不是 Foo 类的实例。

### 不同点

类必须使用 `new` 调用，否则会报错。这是它跟普通构造函数的一个主要区别，`后者不用 new 也可以执行`。

## 类的实例

### 相同点

- 生成类的实例的写法，与 ES5 完全一样，也是使用 `new` 命令
- 实例的属性除非`显式定义在其本身`（即定义在 this 对象上），否则都是`定义在原型上`（即定义在 class 上）。
- 类的所有实例共享一个原型对象。

**实例的属性的论证**

```js {4,5,8,15,16,19,20,21,}
//定义类
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }
}

var point = new Point(2, 3)

point.toString() // (2, 3)
poinit.z = 3
point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('z') // false
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```

> 留意高亮的几行代码。`x`,`y` 都是定义在 `this` 对象上。包括后来的`z`也还在 this 对象上
>
> 而 toString 方法。point 可以调用，可是是挂载了 `Point` 这个类中
>
> 这些都与 ES5 的行为保持一致。

---

**类的所有实例共享一个原型对象**

- ES5 的例子:

  可以查看 [原型和原型链中的一个题目 8](./原型和原型链.html#这样的链条，有什么作用呢？用处体现在哪里？)

  这就是因为题目中的所有实例都共享同一个原型对象，**一个实例中修改原型对象，其余的实例都会受到影响。**

  当然，要慎用！！极度不推荐这么操作，隐蔽性太高，后续维护会很困难

- class 中如何证明

```js {5,8,13,14,17,18}
// class Point ... 省略不写了
var p1 = new Point(2, 3)
var p2 = new Point(3, 2)

p1.__proto__ === p2.__proto__ //true

// 注意这里是 p1 通过原型链，添加了一个 printName 方法
p1.__proto__.printName = function() {
  return 'Oops'
}

p1.printName() // "Oops"
// p2 也可以调用
p2.printName() // "Oops"

var p3 = new Point(4, 2)
// 后来生成的p3 还有这个方法！
p3.printName() // "Oops"
```

## 取值函数（getter）和存值函数（setter）

### 相同点

`类`的内部可以使用 `get` 和 `set` 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

- ES5 写法:

> vue 2.x 框架就是利用 `Object.defineProperty` 进行数据挟持（set 的时候触发自己的方法，get 的时候也是返回对应的值），达到的双向数据绑定

```js
function MyClass() {
  var prop = ''
  Object.defineProperty(this, 'prop', {
    configurable: true,
    enumerable: true,
    get: function() {
      return 'getter'
    },
    set: function(value) {
      console.log('setter: ' + value)
    }
  })
}

var inst = new MyClass()
inst.prop = 123 // setter: 123

inst.prop // getter
```

- 等价于 ES6

```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter'
  }
  set prop(value) {
    console.log('setter: ' + value)
  }
}

let inst = new MyClass()

inst.prop = 123
// setter: 123

inst.prop
// 'getter'
```

## 属性表达式

类的属性名，可以采用表达式。

```js
let methodName = 'getArea'
class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}

var s = new Square()
s.getArea() // 可以调用
s.methodName() // 报错
```

## Class 表达式

与函数一样，类也可以使用表达式的形式定义。

```js
const MyClass = class Me {
  getClassName() {
    return Me.name
  }
}
```

::: tip 需要注意的是，这个类的名字是 `Me`，但是 `Me 只在 Class 的内部可用`，指代当前类。在 Class 外部，这个类只能用 MyClass 引用

```js
let inst = new MyClass()
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

:::

::: tip 如果类的内部没用到的话，可以省略 Me，也就是可以写成下面的形式。

```js
const MyClass = class {
  /* ... */
}
```

:::

## class 的拓展和新提案

### 不存在提升

```js
new Foo() // ReferenceError
class Foo {}
```

### name 属性

由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被 Class 继承，`包括 name 属性`。

```js
class Point {}
Point.name // "Point"
```

### this 的指向

类的方法内部如果含有 `this`，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```js
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`)
  }

  print(text) {
    console.log(text)
  }
}

const logger = new Logger()
const { printName } = logger
printName() // TypeError: Cannot read property 'print' of undefined
```

::: tip

上面代码中，`printName` 方法中的 this，默认指向 Logger 类的实例。

但是，如果将这个方法提取出来单独使用，`this 会指向该方法运行时所在的环境`（由于 class 内部是严格模式，所以 this 实际指向的是 undefined），从而导致找不到 print 方法而报错。

:::

解决方法：

(1) 在构造函数中绑定 `this` 指向

```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this)
  }
  // ...
}
```

(2) 另一种解决方法是使用`箭头函数`。

```js
class Obj {
  constructor() {
    this.getThis = () => this
  }
}

const myObj = new Obj()
myObj.getThis() === myObj // true
```

(3) 使用 `proxy` 获取的时候自动绑定 this

```js
function selfish(target) {
  const cache = new WeakMap()
  const handler = {
    get(target, key) {
      const value = Reflect.get(target, key)
      if (typeof value !== 'function') {
        return value
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target))
      }
      return cache.get(value)
    }
  }
  const proxy = new Proxy(target, handler)
  return proxy
}

const logger = selfish(new Logger())
```

### 静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。

如果在一个方法前，加上 static 关键字，就表示该方法`不会被实例继承`，而是直接通过类来调用，这就称为`静态方法`。

> Foo 类的 `classMethod` 方法前有 `static` 关键字，表明该方法是一个静态方法，可以直接在 Foo 类上调用（`Foo.classMethod()`），而不是在 Foo 类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。

```js
class Foo {
  static classMethod() {
    return 'hello'
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo()
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

::: warning 注意

如果静态方法包含 `this` 关键字，这个 this 指的是`类`，而`不是实例`。

另外，从这个例子还可以看出，静态方法可以与非静态方法重名。

```js
class Foo {
  static bar() {
    this.baz()
  }
  static baz() {
    console.log('hello')
  }
  baz() {
    console.log('world')
  }
}

Foo.bar() // hello
```

:::

父类的静态方法，可以被子类继承。

```js
class Foo {
  static classMethod() {
    return 'hello'
  }
}

class Bar extends Foo {}

// 注意继承后还是静态方法，调用方式还是直接调用
Bar.classMethod() // 'hello'
```

静态方法也是可以从 `super` 对象上调用的。

```js
class Foo {
  static classMethod() {
    return 'hello'
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too'
  }
}

Bar.classMethod() // "hello, too"
```
