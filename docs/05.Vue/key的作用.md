# vue 中 key 的作用

`key` 的特殊属性主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法。使用 key，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。

有相同父元素的子元素必须有`独特的 key`。重复的 key 会造成渲染错误。

## 合理使用 key 可以提高 diff 效率

设置 `key` 的可以在 diff 中更快速的`找到对应节点`，提高 diff 速度

## 什么情况下，使用 key 效率反而低了？

先看一个 dom

```html {17}
<ul id="arr_1">
  <li v-for="item in arr">{{item}}</li>
</ul>

<ul id="arr_2">
  <li v-for="item in arr" :key="index">{{item}}</li>
</ul>

<script>
  export default {
    data() {
      return {
        arr: [0, 1, 2, 3, 4, 5]
      }
    },
    mounted() {
      this.arr = this.arr.reverse()
    }
  }
</script>
```

在简单的模版数组渲染中，新旧节点的 key 都为`undefined`。在判断节点是否相同时，会判断为新旧节点都是同一个，进而不会在执行复杂的循环对比，每一次更新只需要更新对应接点中的文本的内容，这种**原地复用**的效率无疑是最高的。

而当我们设置了 `key` 之后，在进行复杂的判断节点后，移动真实 DOM 的节点的位置或者进行 DOM 节点的添加和删除，这样的查找复用开销肯定要比不带 key 直接原地复用的开销要高。

<!-- 可参考 -->
<!-- https://juejin.im/post/5cb98b926fb9a0688e0677f9 -->
