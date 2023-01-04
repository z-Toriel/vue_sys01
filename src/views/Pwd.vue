<template>
  <div style="text-align: center">
    <h2>{{ userInfo.username }},修改密码</h2>
    <el-form :model="passForm" label-width="80px" ref="passForm" :rules="rules">
      <el-form-item label="旧密码" prop="currentPass">
        <el-input type="password" v-model="passForm.currentPass"></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="passForm.password"></el-input>
      </el-form-item>

      <el-form-item label="重复密码" prop="checkPass">
        <el-input type="password" v-model="passForm.checkPass" ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitFrom('passForm')"
          >提交</el-button
        >
        <el-button @click="resetFrom('passForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  
  data() {
    // 新的验证规则，验证密码和确认密码是否一直
    // value参数：该验证规则验证的是谁，value取值就是谁
    var validatePass = (rule,value,callback) => {
      if(value == ''){
        callback(new Error("请再次输入新密码"))
      }else if (value != this.passForm.password){
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }
    return {
      userInfo: {},
      passForm: {
        id:0,
        currentPass: "",
        password: "",
        checkPass: "",
      },
      rules: {
        currentPass: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {min:6,max:12,message:"密码长度必须在6-12个字符",trigger:'blur'},
        ],
        checkPass: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
      },
    };
  }, // data end
  created() {
    this.getUserInfo();
    this.passForm.id = this.userInfo.id;
  }, // created end
  methods: {
    getUserInfo() {
      this.$axios.get("/user/userInfo").then((res) => {
        this.userInfo = res.data.data;
      });
    },

    submitFrom(passForm) {
      this.$refs[passForm].validate((valid) => {
        if (valid) {
          this.$axios.post("/system/menu/pwd",this.passForm).then((res) => {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success",
              onClose: () => {
                // 修改之后重新获取用户数据

                this.getUserInfo();
                this.resetFrom(passForm);
                // TODO：推出当前用户，跳转到登录页，重新登录
              },
            });
          });
        } else {
          return false;
        }
      });
    },

    resetFrom(passForm) {
      this.$refs[passForm].resetFields()
    },
  }, // methods end
};
</script>

<style scoped>
.el-form{
  width: 420px;
  margin: 50px auto;
}
</style>