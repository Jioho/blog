# null，undefined 的区别

## null

1. 表示一个对象被定义了，值为“空值”
2. 是一个对象(空对象, 没有任何属性和方法)

## undefined

1.  表示不存在这个值。
2.  是一个表示"无"的原始值或者说表示"缺少值"，就是此处应该有一个值，但是还没有定义。当尝试读取时会返回 `undefined`
3.  例如变量被声明了，但没有赋值时，就等于 `undefined`

---

- null 表示一个值被定义了，定义为“空值”；
- undefined 表示根本不存在定义。
- 所以设置一个值为 null 是合理的，如 objA.valueA = null;
- 但设置一个值为 undefined 是不合理的

```js
typeof null // object
typeof undefined // undefined
null == undefined // true
null === undefined // false
```

::: danger
在验证 `null` 时，一定要使用　`===` ，因为 `==`无法分别 `null` 和 `undefined`
:::
