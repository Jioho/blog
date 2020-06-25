# 对 keep-alive 的了解

- `keep-alive` 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。
- `keep-alive` 是一个抽象组件：它自身不会渲染一个 DOM 元素
- 当组件在 `<keep-alive>` 内被切换，它的 `activated` 和 `deactivated` 这两个生命周期钩子函数将会被对应执行。

::: tip 特殊的生命周期
在 2.2.0 及其更高版本中，activated 和 deactivated 将会在 `<keep-alive>` 树内的所有嵌套组件中触发。
:::

::: danger 使用限制
注意，`<keep-alive>` 是用在其一个直属的子组件被开关的情形。如果你在其中有 `v-for` **则不会工作**。如果有上述的多个条件性的子元素，`<keep-alive>` 要求同时只有一个子元素被渲染。
:::

## keep-alive 参数详解

- 参数一览表：
  - `include` <Badge type="warning" text="2.1.0新增"/> 字符串或正则表达式，只有匹配的名称才**会被缓存**
  - `exclude` <Badge type="warning" text="2.1.0新增"/> 字符串或正则表达式，只有匹配的名称才**不会被缓存**
  - `max` <Badge type="warning" text="2.5.0新增"/> 数字类型，最多可以缓存 max 个组件

### include 和 exclude <Badge type="warning" text="2.1.0新增"/>

```html
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```

### max <Badge type="warning" text="2.5.0新增"/>

最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

**最后**：

官网原文链接：[keep-alive](https://cn.vuejs.org/v2/api/#keep-alive)
