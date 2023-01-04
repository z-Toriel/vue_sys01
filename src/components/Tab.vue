<template>
  <!-- closable：可关闭；@tab-remove：绑定一个关闭事件；@tab-click：绑定一个点击事件 -->

  <el-tabs
    v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">

    <el-tab-pane
      v-for="(item) in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >

    </el-tab-pane>
  </el-tabs>



  
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    // 计算属性
    // 表示当前激活的选项卡(选中某个选项卡的过程是自动计算的) 记录在vuex
    editableTabsValue: {
      get() {
        return this.$store.state.menus.editableTabsValue;
      },
      set(val) {
        this.$store.state.menus.editableTabsValue = val;
      },
    },
    // 表示所有正在打开的选项卡 记录在vuex
    editableTabs: {
      get() {
        return this.$store.state.menus.editableTabs;
      },
      set(val) {
        this.$store.state.menus.editableTabs = val;
      },
    },
  },
  methods: {

      removeTab(targetName) {
        // 1.获取所有的选项卡,数组
        let tabs = this.editableTabs;
        // 2.当前激活的选项卡
        let activeName = this.editableTabsValue;

        // 判断默认页面是不能删除的
        if (targetName == "Index") {
          return;
        }

        // 删除当前的选项卡
        if (targetName == activeName) {
          tabs.forEach((tab, index) => {
            if (tab.name == targetName) {
              // 判断数组中的选项卡name
              // 情况1：如果删除的选项卡是最后的，那么删掉之后，它之前的选项卡为默认选项卡

              // 情况2：如果删掉的是中间的，那么删掉之后，它之后的选项卡为默认选项卡

              let nextTab = tabs[index + 1] || tabs[index - 1]; // 删除之后,默认激活的选项卡

              // if()

              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;

        // 如果删除的不是正在激活的选项卡
        this.editableTabs = tabs.filter((tab) => 
          // 过滤出其他所有不需要删除的tab
        tab.name != targetName
        );
        console.log(this.editableTabs)

        this.$router.push({ name: activeName }); // 删除之后,变更路由
      },

    clickTab(target) {
      // console.log("target:",target)
      // 需要根据点击的选项卡,路由跳转 target.name
      this.$router.push({ name: target.name }); // 根据路由中name的值,跳转至指定路由
    },
  },
};
</script>

<style>
</style>