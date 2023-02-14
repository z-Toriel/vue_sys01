<template>
  <el-container>
    <el-aside width="200px">
      <MenuBar></MenuBar>
    </el-aside>
    <el-container>
      <!-- 头部份开始 -->
      <el-header class="headerCls">
        <div class="left" @click="logout">图书馆后台管理系统V1.0</div>
        <div class="right">
          <el-avatar
            class="el-avatar"
            size="medium"
            :src="userInfo.avatar"
          ></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              <span>{{ userInfo.username }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{ name: 'userCenter' }">
                  个人中心
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/pwd">
                  修改密码
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout"> 退出登录 </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 头部份结束 -->
      
      
      <el-main>
        <Tab></Tab>
        <div style="margin: 0 15px">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MenuBar from "@/components/MenuBar.vue";
import Tab from "@/components/Tab.vue"
export default {
  data() {
    return {
      userInfo: {
        // id: "",
        // username: "admin",
        // avatar: require("@/assets/logo.png"),
      },
    };
  },
  created() {
     // 在生命周期中获取用户信息
    this.getUserInfo();
  },
  methods: {
    logout() {
      this.$axios
        .post("/logout").then((res) => {
          localStorage.clear();
          sessionStorage.clear();
          this.$store.commit("resetState")
          this.$router.push('/login')

        })
    },

    // 请求服务端，获取用户的详细信息
    getUserInfo(){
      this.$axios.get('/user/userInfo').then(res=>{
        console.log(res.data)
        this.userInfo = res.data.data;  // 获取响应的用户数据
      })
    }
  },
  components: {
    MenuBar,
    Tab
  },
};
</script>

<style scoped>
.el-container {
  padding: 0;
  height: 100%;
  margin: 0;
}

.headerCls {
  background-color: #409eff;
  color: #fff;
  height: 50px;
  display: flex;
  line-height: 60px;
  justify-content: space-between;
  align-content: center;
}
.headerCls .right{
  display: flex;  
  align-items: center;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 10px;
  text-align: center;
  border-radius: 4px;
  margin-left: 10px;
}

a{
  text-decoration: none;
}
</style>
