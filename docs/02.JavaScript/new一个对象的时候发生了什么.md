# new 一个对象的过程中发生了什么?

1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 确保返回值是一个对象
5. 返回新对象

## 实现一个 new

```js
function create() {
  /**
   * 对于创建一个对象来说，更推荐使用字面量的方式创建对象（无论性能上还是可读性）
   */
  let obj = {}
  /**
   * [].shift.call用法：
   * 这里是因为 arguments 并非真实数组。使用apply改变this指向，使得arguments拥有数组的方法
   * shift 返回参数的第一个值。这边接收的第一个值就是要new的对象，不能为空
   */
  let Con = [].shift.call(arguments)
  if (!Con) throw 'Object of new cannot be empty，new 的对象不能为空'
  obj.__proto__ = Con.prototype
  let result = Con.apply(obj, arguments)
  // 确保返回值为对象
  return result instanceof Object ? result : obj
}

// 调用create方法
function Test(name, age) {
  this.name = name
  this.age = age
}

Test.prototype.sayName = function() {
  console.log(this.name)
}
const test = create(Test, 'Jioho', 22)
console.log(test.name) // 'Jioho'
console.log(test.age) // 22
test.sayName() // 'Jioho'
```
