<template>
  <el-row>
    <el-col :xl="6" :lg="7">
      <h2>欢迎使用图书馆后台管理系统</h2>
      <!-- @符号表示src的根目录 -->
      <el-image
        style="width: 180px; height: 180px"
        :src="require('@/assets/logo.webp')"
      ></el-image>
      <p>SpringBoot2.0+Vue+2.0+Mysql</p>
      <p>万里学院</p>
    </el-col>
    <el-col :span="1" class="test">
      <el-divider direction="vertical"></el-divider>
    </el-col>

    <el-col :xl="6" :lg="7">
      <el-form ref="loginFrom" :model="loginFrom" label-width="80px" label-position="right" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captchaCode">
          <el-input v-model="loginFrom.captchaCode" maxlength="5" style="width:170px; float:left" ></el-input>
          <el-image :src="captcheImg" class="captchaImg" @click="getChaptcha()"></el-image>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginFrom')">登录</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    
  </el-row>
</template>

<script>
export default {
  data(){
    return {
      captcheImg:'',
      loginFrom:{
        username:'',
        password:'',
        captchaCode:'',
        key:''  // 验证码的key
      },
      rules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
        ],
        captchaCode:[
          {required:true,message:'请输入验证码',trigger:'blur'},
          {min:5,max:5,message:'验证码长度为5位',trigger:'blur'}
        ]
      }
    }
  },
  created(){
    this.getChaptcha(); //调用验证码
  },
  methods:{
    // 获取验证码
    getChaptcha(){
      this.$axios.get('/captcha').then((res)=>{
        // 获取的响应的数据
        this.captcheImg = res.data.data.captchaImg;
        // 获取响应头中的key
        this.loginFrom.key = res.data.data.key;
        console.log(res.data.data.captchaImg);
      })
    },

    // 登录
    submitForm(fromName){
      this.$refs[fromName].validate((valid)=>{
        // vaind为true表示验证通过
        if(valid){
          // 请求服务器端，进行登录
          // this.$qs.stringify(this.loginFrom) 将对象转换为字符串
          this.$axios.post('/login',this.$qs.stringify(this.loginFrom))
          .then(res=>{
            // 1.获得登录成功后，响应的token，token的响应是通过response头信息返回的.
            const token = res.headers['token']; //获取响应头中的token
            // 2.在vuex定义commit调用mutations中的方法存储token到localStorage中
            this.$store.commit('SET_TOKEN',token);
            // 登录成功，跳转到首页
            this.$router.push('/');
            // this.$router.push({path:'/home'});  // 登录成功，跳转到首页
          })
          .catch((error)=>{
            console.log("异常：",error)
            this.loginFrom={}
            this.getChaptcha()
          })

        }else {
          // this.getChaptcha()
          return false
        }
      })
    },
  },
};
</script>

<style scoped>
  .el-row{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    text-align: center;
  }

  .el-divider {
    height: 300px;
  }
  .captchaImg{
    width: 100px;
    height: 40px;
    border-radius: 10px;
    margin-left: 10px;
  }
</style>