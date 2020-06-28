# HTML/XHTM/HTML5 的区别

## XHTML

XHTML 元素必须被正确地嵌套。
XHTML 元素必须被关闭。
标签名必须用小写字母。
XHTML 文档必须拥有根元素。

## HTML

XHTML 与 HTML 4.01 标准没有太多的不同。

在 H5 之前，HTML 有许多的错误。所以 XHTML 的出现只是为了规范这些语法，减少错误。然而实在太多，这时候定制的规范为时已晚

## HTML5

它已经远远超越了标记语言的范畴，其背后是一组技术集

- 新增了许多语义化标签 最基本的就是更富语义的标签，以便更好的被机器识别
- Canvas、Video、audio 等新元素的出现
- 对本地离线存储的更好的支持
- 新的表单控件
- 等

## 如何区分 html 和 html5

- 在文档声明上，html 有很长的一段代码，并且很难记住这段代码，都是靠工具直接生成，而 html5 却是不同，只有简简单单的声明，也方便人们的记忆，更加精简。

```html
<!-- HTML 声明方式 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"></html>

<!-- HTML5 声明方式 -->
<!DOCTYPE html>
```

- 在结构语义上；html4.0 没有体现结构语义化的标签，这样表示网站的头部。html5 在语义上却有很大的优势。提供了一些新的 html5 标签。

## IE 如何兼容 H5 新标签

直接看合集把~ [浏览器兼容性问题解决方案](/Html和Http/浏览器兼容性问题解决方案.html)
