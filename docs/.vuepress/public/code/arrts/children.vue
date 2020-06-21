
<template>
  <div class="children">
    children - {{name}}
    <grandson v-bind="$attrs"
              :name="name"
              v-on="$listeners"
              @testChildClick="testChildClick"></grandson>
  </div>
</template>

<script>
import grandson from './grandson'

export default {
  name: 'children',
  props: ['name'],
  inheritAttrs: false,
  components: {
    grandson
  },
  created() {
    console.log('children -----------------')
    this.$emit('testClick')
    console.log('children -----------------')
  },
  methods: {
    testChildClick() {
      console.log('子组件调用了')
    }
  }
}
</script>

<style lang="scss" scoped>
.children {
  width: 300px;
  height: 300px;
  background-color: rgb(138, 194, 138);
  text-align: center;
  color: #ffffff;
  font-size: 18px;
}
</style>
