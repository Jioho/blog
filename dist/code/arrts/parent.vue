
<template>
  <div class="parent">
    parent
    <children :name="name"
              :age="age"
              :sex="sex"
              @testClick="testClick"
              @testChildClick="testChildClick"></children>
  </div>
</template>

<script>
import children from './children'
export default {
  name: 'parent',
  data() {
    return {
      name: 'Jioho',
      age: 18,
      sex: '男'
    }
  },
  components: {
    children: children
  },
  methods: {
    testClick() {
      console.log('testClick ...')
    },
    testChildClick() {
      console.log('testChildClick ...')
    }
  }
}
</script>

<style lang="scss" scoped>
.parent {
  width: 400px;
  height: 400px;
  background-color: green;
  text-align: center;
  color: #ffffff;
  font-size: 18px;
}
</style>
