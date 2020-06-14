# 如何理解 CSS 的盒子模型？

## 标准盒子模型：宽度=内容的宽度（content）+ border + padding

> 属性只包含 width,height。不包含 border，paddinig

## 低版本 IE 盒子模型：宽度=内容宽度（content+border+padding）

> 属性包含 width,height 和 border，paddinig

## 兼容性

:::tip 兼容性

- 在 ie8+浏览器中使用哪个盒模型可以由 box-sizing(CSS 新增的属性)控制，默认值为 content-box，即标准盒模型
- 如果将 box-sizing 设为 border-box 则用的是 IE 盒模型。
- 如果在 ie6,7,8 中 DOCTYPE 缺失会触发 IE 模式。
- 在当前 W3C 标准中盒模型是可以通过 box-sizing 自由的进行切换的。

:::
