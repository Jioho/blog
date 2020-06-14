# 让一个 div 垂直居中

## 高度固定的

```css
/* 父级元素 */
.parent {
  height: 200px;
  width: 200px;
}

/* 子元素 */
.parent .child {
  width: 100px;
  height: 100px;
  margin: 50px;
}
```

## 高度不固定 - 定位法

```css
/* 父级元素 */
.parent {
  position: relative;
}

/* 子元素 */
.parent .child {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

## 高度不固定 - flex 布局

```css
/* 父级元素 */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 子元素 */
.parent .child {
  width: 100px;
  height: 100px;
}
```
