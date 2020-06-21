
<template>
  <div class="grandson">
    <div>name:{{name}}</div>
    <div>age:{{age}}</div>
    <div>sex:{{$attrs['sex']}}</div>
  </div>
</template>

<script>
export default {
  name: 'grandson',
  props: ['name', 'age'],
  created() {
    console.log('grandson -----------------')
    this.$emit('testClick')
    this.$emit('testChildClick')
    console.log('grandson -----------------')
  }
}
</script>

<style lang="scss" scoped>
.grandson {
  width: 200px;
  height: 200px;
  background-color: blue;
  color: #ffffff;
  font-size: 18px;
}
</style>
