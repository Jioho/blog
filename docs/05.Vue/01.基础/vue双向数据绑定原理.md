# vue 双向数据绑定原理

::: tip
vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
:::

## 何为双向数据流，单向数据流呢？

::: tip 单向数据流
顾名思义，数据流是单向的。数据流动方向可以跟踪，流动单一，追查问题的时候可以更快捷。缺点就是写起来不太方便。要使 UI 发生变更就必须创建各种 action 来维护对应的 state
:::

::: tip 双向数据绑定
数据之间是相通的，将数据变更的操作隐藏在框架内部。优点是在表单交互较多的场景下，会简化大量与业务无关的代码。缺点就是无法追踪局部状态的变化，增加了出错时 debug 的难度。
:::

## MVC 和 MVVM

说到双向数据绑定就不能不提 `MVVM`。说 MVVM，又不得不提一下 MVC

### MVC

很早之前的框架普遍用的都是 MVC 模式。`M（模型 model)` 、`V（视图Views）`、`C（控制器Controller）`

特点：

- View 传送指令到 Controller；
- Controller 完成业务逻辑后，要求 Model 改变状态；
- Model 将新的数据发送到 View，用户得到反馈。

**所有通信都是单向的。**

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623115152.png)

### MVVM

特点：

- 各部分之间的通信，都是双向的；
- 采用双向绑定： View 的变动，自动反映在 ViewModel，反之亦然。

![](https://gitee.com/Jioho/img/raw/master/knowledge/20200623115207.png)
