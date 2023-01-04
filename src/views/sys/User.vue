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
        <!-- TODO:新建需要进行权限验证 -->

        <el-button type="primary" v-if="hasAuth('sys:user:save')" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteUser()">
            <el-button slot="reference" v-if="hasAuth('sys:user:delete')" type="danger" :disabled="deleteBtnStu"
              >批量删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-form-item>
    </el-form>

    <!-- 用户的信息表格 -->
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
      <el-table-column label="角色名称" prop="name">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            v-for="(item, index) in scope.row.roles"
            :key="index"
            style="margin-left: 5px"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="手机号" prop="tel"></el-table-column>
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
      <el-table-column label="创建时间" prop="created"></el-table-column>

      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="text" v-if="hasAuth('sys:user:role')" @click="roleMethod(scope.row.id)"
            >分配角色</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" v-if="hasAuth('sys:user:update')" @click="editUser(scope.row.id)"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <el-button
            type="text"
            @click="resetPass(scope.row.id, scope.row.username)"
            v-if="hasAuth('sys:user:repass')"
            >重置密码</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除该用户吗？"
              v-if="hasAuth('sys:user:delete')"
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
        <el-form-item label="上传图片">
          <!-- 
          action="服务器接口路径"
          :headers="headers"  headers就是变量中存储 请求需要的token
         -->
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- {{ imageUrl }} -->
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <!-- <el-form-item label="手机号" prop="tel">
          <el-input v-model="userForm.tel"></el-input>
        </el-form-item> -->
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

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogFormVisble"
      width="600px"
    >
      <el-form ref="roleForm" :model="roleForm" label-width="80px">
        <!-- props就是树型控件的关键 -->
        <el-tree
          ref="roleTree"
          :data="roleTreeData"
          node-key="id"
          :props="defaultProps"
          show-checkbox
          :default-expand-all="true"
          :check-strictly="true"
        >
        </el-tree>
      </el-form>
      <div slot="footer">
        <el-button @click="roleDialogFormVisble = false">取消</el-button>
        <el-button type="primary" @click="submitRoleForm('roleForm')"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: "", //图片的链接
      headers: { token: localStorage.getItem("token") }, //需要把本地的token带上
      // 树形控件
      defaultProps: {
        label: "name", // 角色的名字
        children: "children",
      },
      searchForm: {}, // 搜索的条件
      dialogFormVisble: false,
      roleDialogFormVisble: false,
      roleForm: {}, //给用户分配的角色表单对象
      roleTreeData: [], //树形控件中的数据
      deleteBtnStu: true,
      tableData: [], // 用户表格的数组
      current: 1,
      size: 10,
      total: 0,
      selection: [], // 用于保存批量删除的数据
      userForm: {avatar:''}, // 用于保存添加或修改用户的信息
      rules: {
        // avatar: [{ required: true, message: "请输入头像", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
        tel: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
      },
    };
  }, // data end
  created() {
    this.getUserList();
    // 获取用户的权限信息
    this.$axios.get("/system/role/list").then((response) => {
      this.roleTreeData = response.data.data.records;
    });
  },
  methods: {
    // 图片的上传
    handleAvatarSuccess(res, file) {
      // console.log(res.data);
      // this.url = res.data; //存储到Java项目中图片的路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.userForm.avatar = res.data
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },

    getUserList() {
      // 获的所有用户的信息
      this.$axios
        .get("/system/user/list", {
          params: {
            name: this.searchForm.username,
            current: this.current,
            size: this.size,
          },
        })
        .then((response) => {
          this.tableData = response.data.data.records;
          this.size = response.data.data.size;
          this.current = response.data.data.current;
          this.total = response.data.data.total;
        });
    },
    deleteUser(id) {
      // 删除一个或批量删除用户的方法
      // 如果时删除单个的话，会传递一个id进来。如果没有，则是删除多个
      let userIds = [];
      id
        ? userIds.push(id)
        : this.selection.forEach((item) => {
            userIds.push(item.id);
          });
      console.log(userIds);
      this.$axios.post("/system/user/delete", userIds).then((response) => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
          onClose: () => {
            // 删除成功之后，重新请求用户列表
            this.getUserList();
          },
        });
      });
    },
    selectionChange(val) {
      //复选框选中的事件
      this.selection = val;
      this.deleteBtnStu = this.selection.length == 0;
    },
    submitRoleForm(formName) {
      // 保存分配角色对话框
      var roleIds = this.$refs.roleTree.getCheckedKeys();
      console.log("分配的角色ID:", roleIds);
      this.$axios
        .post("/system/user/role/" + this.roleForm.id, roleIds)
        .then((res) => {
          this.$message({
            showClose: true,
            message: "分配角色操作成功",
            type: "success",
            onClose: () => {
              this.getUserList();
            },
          });
          this.roleDialogFormVisble = false;
        });
    },
    roleMethod(id) {
      //分配角色
      this.$axios.get("/system/user/info/" + id).then((response) => {
        let system_user = response.data.data; // 查询返回这个id的用户信息

        this.roleForm = system_user;

        let roles = []; //数组，用户存储当前用户角色信息
        system_user.roles.forEach((role) => {
          roles.push(role.id); //当前用户的角色id，全部存入数组
        });

        this.$refs.roleTree.setCheckedKeys(roles);
      });
      this.roleDialogFormVisble = true;
    },
    editUser(id) {
      // 编辑用户
      this.$axios.get("/system/user/info/" + id).then((response) => {
        this.userForm = response.data.data;
        this.dialogFormVisble = true;
      });
    },
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
        this.$axios.post("/system/user/repass/" + id).then((response) => {
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
      this.$refs[formName].validate((valid) => {
        // 根据userForm判断是更新还是添加，
        if (valid) {
          this.$axios
            .post(
              "/system/user/" + (this.userForm.id ? "update" : "save"),
              this.userForm
            )
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
          this.dialogFormVisble = false;
        } else {
          return false;
        }
      });
    },

    resetForm(formName) {
      //重置表单
      this.$refs[formName].resetFields(); // 重置
      this.userForm = {avatar:''};
      this.dialogFormVisble = false;

    },

    
  },
};
</script>


<style scoped>
.avatar {
  width: 80px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>