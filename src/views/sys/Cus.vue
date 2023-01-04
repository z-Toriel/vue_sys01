<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.username"
          placeholder="请输入搜索的名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getUserList()">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteUser()">
            <el-button slot="reference" type="danger" :disabled="deleteBtnStu"
              >批量删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-form-item>
    </el-form>

    <!-- 用户信息表 -->
    <!-- 
      stripe：是否为斑马纹 
      border：是否有边框
      default-expand-all：默认展示所有
      :cell-style="{ padding: 2 }" 边距为2
      @selection-change="selectionChange" 多选的时候绑定事件
    -->
    <el-table
      :data="tableData"
      stripe
      border
      default-expand-all
      :cell-style="{ padding: 2 }"
      style="width: 100%; margin-bottom: 20px"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="头像" width="50">
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="昵称" prop="nickname"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="生日" prop="birthday"></el-table-column>
      <el-table-column label="性别" prop="gender">
        <template slot-scope="scope">
          <span v-if="scope.row.gender == 1">男生</span>
          <span v-if="scope.row.gender == 0">女生</span>
        </template>
      </el-table-column>
      <el-table-column label="个人简介" prop="info"></el-table-column>
      <el-table-column label="创建时间" prop="created"></el-table-column>
      <el-table-column label="状态" prop="statu">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu == 1" type="success" size="mini"
            >正常</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 0" type="danger" size="mini"
            >禁用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="text" @click="editUser(scope.row.id)"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <el-button
            type="text"
            @click="resetPass(scope.row.id, scope.row.username)"
            >重置密码</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除该用户吗？"
              @confirm="deleteUser(scope.row.id)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 新增或编辑用户对话框 -->
    <el-dialog
      title="角色信息"
      :visible.sync="dialogFormVisble"
      width="600px"
      @closed="resetForm('userForm')"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="用户头像" prop="avatar">
          <!-- <el-input v-model="userForm.avatar"></el-input> -->
          <el-image :src="userForm.avatar" class="avatar"></el-image>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <!-- <el-input v-model="userForm.birthday"></el-input> -->
          <el-date-picker v-model="userForm.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="userForm.gender">
            <el-radio :label="1">男生</el-radio>
            <el-radio :label="0">女生</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个人简介" prop="info">
          <el-input v-model="userForm.info" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="userForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('userForm')">取 消</el-button>
        <el-button type="primary" @click="submitUserForm('userForm')">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
      dialogFormVisble: false, //添加或修改的对话框是否显示
      deleteBtnStu: true, // 批量删除的按钮是否使用
      tableData: [], // 表格中的数据
      current: 1,
      size: 10,
      total: 0,
      selection: [], // 用于保存批量删除的数据
      userForm: {}, // 用于保存添加或修改用户的信息
      rules: {
        username: [{required: true, message:'请输入用户名', trigger: 'blur'}],
        email: [{required: true, message:'请输入邮箱', trigger: 'blur'}],
        birthday: [{required: true, message:'选择生日', trigger: 'blur'}],
        gender: [{required: true, message:'请选择性别', trigger: 'blur'}],
        statu:  [{required: true, message:'请选择状态', trigger: 'blur'}],
      },
    };
  }, // dataend
  created() {
    this.getUserList();
  },
  methods: {
    selectionChange(val) {
      //批量删除的change
      this.selection = val
      this.deleteBtnStu = this.selection.length == 0
    },
    getUserList() {
      //获取用户列表
      this.$axios
        .get("/system/cus/list", {
          params: {
            name: this.searchForm.username,
            // current: this.current,
            // size: this.size,
          },
        })
        .then((response) => {
          this.tableData = response.data.data;
          // this.size = response.data.data.size;
          // this.current = response.data.data.current;
          // this.total = response.data.data.total;
        });
    },
    deleteUser(id) {
      // 删除用户的方法
      let userIds = [];
      id ? userIds.push(id) : this.selection.forEach((item) => {
        userIds.push(item.id)
      })
      console.log(userIds)
      this.$axios.post('/system/user/delete',userIds).then((response) => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
          onClose: () => {
            this.getUserList()
          }
        })
      })
    },

    editUser(id) {
      // 编辑用户的方法
      console.log("用户id：",id)
      this.$axios.get("/system/cus/info/"+id).then((response) => {
        this.userForm = response.data.data
        this.dialogFormVisble = true
      })
    },

    //重置密码
    resetPass(id, username) {
      this.$confirm(
        `重置用户【${username}】的密码，是否继续该操作`,
        "重置密码提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        // 请求服务器端，进行重置密码的请求操作
        this.$axios.post("/system/user/repass", id).then((response) => {
          if (response.data.code == 200 && response.data.code != undefined) {
            this.$message({
              showClose: true,
              type: "success",
              message: "重置密码成功",
            });
          }
        });
      });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getUserList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getUserList();
    },

    submitUserForm(formName) {
      // 提交表单信息
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/system/user/" + (this.userForm.id ? "update" : "save"))
            .then((response) => {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success",
                onClose: () => {
                  //重新请求用户列表
                  this.getUserList();
                },
              });
            });
            this.dialogFormVisble = false
        }else{
          return false
        }
      })
    },

    resetForm(formName) {
      //重置表单
      this.$refs[formName].resetFields(); // 重置
      this.userForm = {};
      this.dialogFormVisble = false;
    },
  },
};
</script>

<style>
</style>