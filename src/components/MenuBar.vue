<template>
  <el-menu
    class="el-menu-vertical-demo"
    :default-active="this.$store.state.menus.editableTabsValue"
    active-text-color="#ff8d2e"
    text-color="#fff"
    background-color="#4f5567"
  >
    <router-link to="/index">
      <el-menu-item index="Index" @click="selectMenuIndex('Index')">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
    </router-link>

    <el-submenu :index="menu.name" v-for="(menu, index) in menuList" :key="index">
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </template>
      <router-link
        :to="item.path"
        v-for="(item, index) in menu.children"
        :key="index"
      >
        <el-menu-item :index="item.name" @click="selectMenu(item)">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-submenu>

  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      // menuList: this.$getSessionStorage("menuList"),
      menuList : this.$store.state.menus.menuList,
    };
  },
  created() {
    //this.getMenuList();
  },
  methods: {
    // 获取服务器端的菜单
    // getMenuList() {
    //   this.$axios.get("/menu/nav").then((response) => {
    //     this.menuList = response.data.data.nav;
    //   });
    // },



    // 选择菜单的方法
    selectMenu(item) {
      // 
      let obj ={
        title: item.title,
        name: item.name,
      }
      // 调用vuex中的addTabs方法添加选项卡
      this.$store.commit('addTabs',obj)
    },

    selectMenuIndex(index){
      this.$store.commit('setActiveTab',index)
    }
  },
};
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 200px;
  height: 100%;
  border-right: 1px solid #dcdfe6;
}
</style>
