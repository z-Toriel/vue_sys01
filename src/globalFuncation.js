// 全局函数
// mixin作用多个组件可以共享数据和方法
import Vue from "vue";

Vue.mixin({
  methods:{
    // 验证权限的方法
    hasAuth(perm){
      // perm权限字符串：sys:user:save
      // 1.得到当前用户所有的权限字符串
      var authority = this.$store.state.menus.permList
      return authority.indexOf(perm) > -1 
    }
  }
})