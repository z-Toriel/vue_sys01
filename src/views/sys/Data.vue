<template>
  <div>
    <h3>输入的name的字符长度是:{{nameLength}}</h3>
    <input type="text" v-model="name">
  </div>
</template>

<script>
export default {
  data(){
    return{
      name: 'Lucy',
    }
  },
  computed:{
    nameLength:{
      get(){
        return this.name.length
      },
      set(){}
    }
  }
}
</script>

<style>

</style>