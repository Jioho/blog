# BFC 是什么 怎么生成 BFC BFC 作用

## BFC 解释：

块级格式化上下文(block formatting context)

> 块级格式化上下文，是一个独立的渲染区域，让处于 BFC 内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。
> TODO 补充完整的 BFC 相关截图

## 创建规则 :

- 根元素
- 浮动元素 **(float 不为 none)**
- 绝对定位元素 **(position 取值为 absolute 或 fixed）**
- `display` 取值为 ：`inline-box`、`table-cell`、`table-caption`、`flex`、`inline-flex` 之一的元素
- `overflow` 不为 `visible` 的元素

## 作用：

- 可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个 div 都位于`同一个 BFC` 区域之中)
- 不被浮动元素覆盖
- 阻止父子元素的 [margin 折叠](./margin折叠.html)
