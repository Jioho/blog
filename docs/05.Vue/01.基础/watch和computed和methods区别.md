# watch 、 computed 、methods 区别.md

## 1. watch

> watcher 更像是一个 data 的数据监听回调，当依赖的 data 的数据变化，执行回调，在方法中会传入 newVal 和 oldVal。可以提供输入值无效，提供中间值 特场景。Vue 实例将会在实例化时调用 `$watch()`，遍历 watch 对象的每一个属性。如果你需要在某个数据变化时做一些事情，使用 watch

- watch 的对象必须是 `data` 中或者`computed` 的对象
- watch 在 beforeCreate 到 create 的生命周期之间**初始化了 watch 属性**，在 beforeMounted 的时候挂载，在 mounted 后才开始监听
- watch 属于被动类型，响应某些值的变化

### 1.1 watch 使用示范 1

**重点**:这时候如果页面获取 `{{fullName}}` 得到的是空。因为 watch 默认不执行。只有当 `firstName`或者`lastName` 在 mounted 周期后，值修改了。watch 才会监听到，fullName 才会发生变化

```js
export default {
  data() {
    return {
      firstName: 'Chen',
      lastName: 'Jioho',
      fullName: ''
    }
  },
  watch: {
    firstName: function(val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function(val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
}
```

### 1.2 让 watch 在页面加载完后，立刻执行一次

用到了一个属性： `immediate`。默认是 false。设置为 true 后，就会立刻执行一次 watch 函数的内容

如果要加属性，那监听的对象就不能是一个函数了，需要把函数内容放到 `handle` 中去

```js {15}
export default {
  data() {
    return {
      firstName: 'Chen',
      lastName: 'Jioho',
      fullName: ''
    }
  },
  watch: {
    firstName: {
      handler(newName, oldName) {
        this.fullName = newName + ' ' + this.lastName
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    },
    lastName: function(val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
}
```

### 1.3 deep 属性 深度监听

watch 默认只能监听简单类型的数据，如果要监听对象嵌套的数据，需要用到 `deep` 属性。deep 默认值也是 `false`

> user 对象中有 2 个属性，之前的 watch 需要分别监听 2 次
>
> 现在改成直接深度监听 user 一个对象，那就可以监听到 user 里面每个属性的修改了

```js {18}
export default {
  data() {
    return {
      user: {
        firstName: 'Chen',
        lastName: 'Jioho'
      },
      fullName: ''
    }
  },
  watch: {
    user: {
      handler(newName, oldName) {
        this.fullName = newName.firstName + ' ' + newName.firstName
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true // 标识开启深度监听
    }
  }
}
```

## 2. computed

> computed 看上去是方法，但是实际上是计算属性，它会根据你所依赖的数据动态显示新的计算结果。
>
> 计算结果会被缓存，computed 的值在 getter 执行后是会缓存的，只有在它依赖的属性值改变之后，下一次获取 computed 的值时才会重新调用对应的 getter 来计算

- computed 不能定义在 `data` 中。必须是一个全新的字段
- computed 在 beforeCreate 到 create 的生命周期之间创建的，不过要在 mounted 周期后，才能被调用。
- computed 属于可以被调用的类型，调用了才会开始计算

### 2.1. 默认的 get 用法

由于计算结果会被缓存，在第一次获取 `{{fullName}}` 后，第二次在获取就无须重复进过计算

```js
// 在html中。直接使用 {{fullName}} 即可获取到 `Chen Jioho`

export default {
  data() {
    return {
      firstName: 'Chen',
      lastName: 'Jioho'
    }
  },
  computed: {
    fullName: function() {
      return this.firstName + ' ' + this.lastName
    }
  }
}
```

### 2.2. get 和 set 用法

computed 计算的属性也是可以重新复制的，需要定义 set 方法。
不过 set 的场景用的比较少。多数的 computed 都是通过很多计算式计算出来，很少会逆推回去。

```js
export default {
  data() {
    return {
      firstName: 'Chen',
      lastName: 'Jioho'
    }
  },
  computed: {
    fullName: {
      get() {
        return this.firstName + ' ' + this.lastName
      },
      set(val) {
        const names = val.split(' ')
        console.log(names)
        this.firstName = names[0]
        this.lastName = names[1]
        return this.firstName + ' ' + this.lastName
      }
    }
  }
}
```

## 3. methods

methods 是当前页面方法的集合。当然也可以用作于函数的计算，和`computed` 类似，计算后返回对应的结果(`return`)。

和 `computed` 不同的是，methods 计算结果并不会缓存。而且如果依赖的值更新了。methods 也不会重新计算，除非对应的的节点重新渲染，才会重新调用 methods

## 总结

### watch 和 computed 的区别：

- 属性来源：

  - `watch`：必须是已有的`data`中的属性。或者`computed` 定义的属性
  - `computed`：必须是 data 中没有的，也不能和 `methods` 的属性重名
  - `methods` 和 computed 一样，名称不能是已有的，或者 computed 已经用了的名称。

- 触发方式

  - `watch` ：监听的属性变化才会触发。或者使用**immediate**属性
  - `computed` ：在有需要用到的时候调用就会触发。属性变化也会重新计算
  - `methods` ： 有需要用到才会触发，属性变化了也不会重新计算

- 适用场景
  - `watch` ： 监听某个值变化，作出响应，或者在 watch 中可以使用`异步函数`，在触发响应
  - `computed` ：适用于需要监听多个值计算得出的计算结果的场景，计算后结果会被缓存，不可以使用异步函数。使用异步函数将不能及时响应。
  - `watch`：更适用于一次性数据，不管依赖数据怎么变化，都不用重新计算那种，不过methods更适用于事件绑定，并非计算属性

### 相同点

- 都是在 `beforeCreate` 到 `create` 期间被声明属性
- 都需要在 `mounted` 后才可以调用
