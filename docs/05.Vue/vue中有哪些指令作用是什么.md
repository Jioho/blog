# vue 中有哪些指令作用是什么

[[toc]]

## v-if v-else-if v-else

if else 指令。用于控制节点是否渲染。如果 if 为 false 的话，页面是不会渲染对应的节点。if 的每次 true 和 false 切换都会引起 dom 的新增/删除，相对来说开销较大（注意是相对来说）

v-if 为 `false` 的时候，如果是组件，那么组件将会触发 `beforeDestroy` `destroyed` 的生命周期进行销毁。

> 拓展：如果子组件还嵌套着组件，使用 `v-if="false"` 会先销毁最里层子组件，在逐渐向父组件删除。

## v-show

v-show 相对 v-if 会友好一些。v-show 实际上是给节点啊添加了 `display:none` 属性，只隐藏，不会引起 dom 的重新计算，对应的组件也不会销毁。

## v-for

循环事件 `v-for="(item,index) in 10"` 常用 `for in` 语法。item 就是对应的项的值，index 则为对象的索引（从 0 开始）。使用 `v-for` 需要配合`key` 使用。目的也是提高网页性能

> v-if 和 v-for 不要在同一节点一起使用，默认来说 `v-if`的优先级会更高，可能会引发循环直接不渲染的情况，尽量避免一起使用

## v-bind / :

绑定指令，绑定各种对象和值，缩写为 `:`

## v-on / @

`v-on` 和我们平时写的 `onclick` 含义差不多  
`v-on:click="handle()"` 或者不带参数也行 `v-on:click="handle()"`

简写：  
`@click="handle()"` / `@click="handle"`

- v-on 还提供了很多修饰符

  - `.stop` - 调用 event.stopPropagation()。
  - `.prevent` - 调用 event.preventDefault()。
  - `.capture` - 添加事件侦听器时使用 capture 模式。
  - `.self` - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
  - `.{keyCode | keyAlias}` - 只当事件是从特定键触发时才触发回调。
  - `.native` - 监听组件根元素的原生事件。
  - `.once` - 只触发一次回调。
  - `.left` - (2.2.0) 只当点击鼠标左键时触发。
  - `.right` - (2.2.0) 只当点击鼠标右键时触发。
  - `.middle` - (2.2.0) 只当点击鼠标中键时触发。
  - `.passive` - (2.3.0) 以 { passive: true } 模式添加侦听器

## v-model

用于表单和数据的双向数据绑定。当然也可以在组件中使用 `v-model` 来同步组件中的状态（比如一个弹窗的显示隐藏，就可以用 `v-model` 来管理）

- 对于表单的组件来说，`v-model` 也提供了很多`修饰符`：

  - `v-model.lazy` - 取代 input 监听 change 事件
  - `v-model.number` - 输入字符串转为有效的数字
  - `v-model.trim` - 输入首尾空格过滤

## v-html

更新元素的 `innerHTML`

在单文件组件里，`scoped 的样式`**不会应用在 v-html 内部**，因为那部分 HTML 没有被 Vue 的模板编译器处理。如果你希望针对 v-html 的内容设置带作用域的 CSS，你可以替换为 CSS Modules 或用一个`额外的全局 <style> 元素`手动设置类似 BEM 的作用域策略。

::: danger 慎用
网站上动态渲染任意 HTML 是非常危险的，因为容易导致 `XSS 攻击`。只在可信内容上使用 v-html，永不用在用户提交的内容上。
:::

## v-text

更新元素的 textContent。如果要更新部分的 textContent，需要使用 {{ Mustache }} 插值。

## v-pre

因为 vue 渲染的语法是 `{{}}`。可是并不能避免我们在页面上也想输出`{{}}` 这种符号。就可以用到 `v-pre`  
跳过大量没有指令的节点会加快编译。

<span v-pre>{{ this will not be compiled }}</span>

## v-cloak

这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。

```css
[v-cloak] {
  display: none;
}
```

```html
<!-- 假设前面有大量的节点在渲染，耗时5s才到这个节点 -->
<div v-cloak>
  {{ message }}
</div>
```

不会显示，直到编译结束。

## v-once

只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

## v-slot / `#`

插槽语法，缩写是 `#`  
可放置在函数参数位置的 JavaScript 表达式 (在支持的环境下可使用解构)。可选，即只需要在为插槽传入 prop 的时候使用。

下面表示插入到一个 `具名插槽（header）中`

```html
<div>
  <template #header></template>
  <template v-slot:header></template>
</div>
```

也可以使用插槽传参。value 就是要传递的参数甚至可以使用解构赋值

```html
<div>
  <template #header="value">
    {{header.value}}
  </template>
  <template v-slot:header="value">
    {{header.value}}
  </template>

  <template v-slot:header="{x,y}">
    {{x}} {{y}}
  </template>
</div>
```
