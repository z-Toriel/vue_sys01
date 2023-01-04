<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.fansname"
          placeholder="请输入搜索的名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getFansList()">搜索</el-button>
        <!-- TODO:新建需要进行权限验证 -->

        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteFans()">
            <el-button slot="reference" type="danger" :disabled="deleteBtnStu"
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
      <el-table-column label="ID(手机号)" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="性别" prop="sex">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 1">男</span>
          <span v-if="scope.row.sex == 0">女</span>
        </template>
      </el-table-column>
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
          <el-button type="text" @click="editFans(scope.row.id)"
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
              @confirm="deleteFans(scope.row.id)"
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
      @closed="resetForm('fansForm')"
    >
      <el-form
        ref="fansForm"
        :model="fansForm"
        label-width="100px"
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
            <img v-if="fansForm.avatar" :src="fansForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- {{ imageUrl }} -->
        </el-form-item>
        <el-form-item label="ID(手机号)" prop="id">
          <el-input v-model="fansForm.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="fansForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="fansForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="fansForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="fansForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('fansForm')">取 消</el-button>
        <el-button type="primary" @click="submitFansForm('fansForm')">
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
      imageUrl: "", //图片的链接
      headers: { token: localStorage.getItem("token") }, //需要把本地的token带上
      searchForm: {}, // 搜索的条件
      dialogFormVisble: false,
      deleteBtnStu: true,
      tableData: [], // 用户表格的数组
      current: 1,
      size: 10,
      total: 0,
      selection: [], // 用于保存批量删除的数据
      fansForm: { avatar: "" }, // 用于保存添加或修改用户的信息
      rules: {
        // avatar: [{ required: true, message: "请输入头像", trigger: "blur" }],
        id: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
      },
    };
  }, // data end
  created() {
    this.getFansList();
  },
  methods: {
    // 图片的上传
    handleAvatarSuccess(res, file) {
      // console.log(res.data);
      // this.url = res.data; //存储到Java项目中图片的路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.fansForm.avatar = res.data;
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

    getFansList() {
      // 获的所有用户的信息
      this.$axios
        .get("/system/fans/list", {
          params: {
            name: this.searchForm.fansname,
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
    deleteFans(id) {
      // 删除一个或批量删除用户的方法
      // 如果时删除单个的话，会传递一个id进来。如果没有，则是删除多个
      let fansIds = [];
      id
        ? fansIds.push(id)
        : this.selection.forEach((item) => {
            fansIds.push(item.id);
          });
      console.log(fansIds);
      this.$axios.post("/system/fans/delete", fansIds).then((response) => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
          onClose: () => {
            // 删除成功之后，重新请求用户列表
            this.getFansList();
          },
        });
      });
    },
    selectionChange(val) {
      //复选框选中的事件
      this.selection = val;
      this.deleteBtnStu = this.selection.length == 0;
    },
    editFans(id) {
      // 编辑用户
      this.$axios.get("/system/fans/info/" + id).then((response) => {
        this.fansForm = response.data.data;
        this.dialogFormVisble = true;
      });
    },
    resetPass(id, fansname) {
      this.$confirm(
        `重置用户【${fansname}】的密码，是否继续该操作`,
        "重置密码提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        // 请求服务器端，进行重置密码的请求操作
        this.$axios.post("/system/fans/repass/" + id).then((response) => {
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
      this.getFansList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getFansList();
    },

    submitFansForm(formName) {
      this.$refs[formName].validate((valid) => {
        // 根据fansForm判断是更新还是添加，
        if (valid) {
          this.$axios
            .post(
              "/system/fans/" + (this.fansForm.created ? "update" : "save"),
              this.fansForm
            )
            .then((response) => {
              if ((response.data.code = 200)) {
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success",
                  onClose: () => {
                    //重新请求用户列表
                    this.getFansList();
                  },
                });
              }
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
      this.fansForm = { avatar: "" };
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