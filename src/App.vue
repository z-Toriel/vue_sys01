<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "App",
    };
  },
  watch: {
    // 解决刷新页面的时候,浏览器没有保留激活的tab选项卡
    $route(to, form) {
      if (to.path == "/"){
        this.$router.push("/index")
      }else if (to.path != "/login") {
        let obj = {
          name: to.name,
          title: to.meta.title,
        };
        this.$store.commit("addTabs", obj);
      }
    },
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  padding: 0;
  margin: 0;
  color: #494949;
  font-size: 15px;
}
</style>

