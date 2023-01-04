<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.bookname"
          placeholder="请输入书籍的名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="category">
        <el-select
          v-model="searchForm.categoryId"
          filterable
          clearable
          placeholder="请选择电影类型"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- <el-input v-model="bookForm.category"></el-input> -->
      </el-form-item>

      <el-form-item>
        <el-button @click="getBookList()">搜索</el-button>
        <!-- TODO:新建需要进行权限验证 -->

        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteBook()">
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
      <el-table-column label="封面" width="110px">
        <template slot-scope="scoped">
          <el-image style="width: 100px" :src="scoped.row.cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="书名" prop="name"></el-table-column>
      <el-table-column label="作者" prop="author"></el-table-column>
      <el-table-column label="类型" prop="category"></el-table-column>
      <el-table-column label="地区" prop="region"></el-table-column>
      <el-table-column label="出版社" prop="press"></el-table-column>
      <el-table-column label="数量" prop="total"></el-table-column>
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
      <el-table-column
        label="创建时间"
        prop="created"
        width="180px"
      ></el-table-column>

      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="text" @click="editBook(scope.row.id)"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除该书籍吗？"
              @confirm="deleteBook(scope.row.id)"
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
      title="书籍信息"
      :visible.sync="dialogFormVisble"
      width="600px"
      @closed="resetForm('bookForm')"
    >
      <el-form
        ref="bookForm"
        :model="bookForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="上传书籍封面">
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
            <img v-if="bookForm.cover" :src="bookForm.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- {{ imageUrl }} -->
        </el-form-item>
        <el-form-item label="书籍名称" prop="name">
          <el-input v-model="bookForm.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="bookForm.author"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="category">
          <el-select
            v-model="bookForm.categoryId"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="bookForm.category"></el-input> -->
        </el-form-item>

        <el-form-item label="地区" prop="region">
          <el-input v-model="bookForm.region"></el-input>
        </el-form-item>

        <el-form-item label="出版社" prop="press">
          <el-input v-model="bookForm.press"></el-input>
        </el-form-item>

        <el-form-item label="数量" prop="total">
          <el-input-number
            v-model="bookForm.total"
            :min="1"
            :max="10"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="bookForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('bookForm')">取 消</el-button>
        <el-button type="primary" @click="submitBookForm('bookForm')">
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
      bookForm: { cover: "" }, // 用于保存添加或修改用户的信息
      categoryList: [], //用户保存类型的的列表[{},{},{}]
      rules: {
        name: [{ required: true, message: "请输入书名", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  }, // data end
  created() {
    this.getBookList();
    this.getCategoryList();
  },
  methods: {
    // 获取所有分类的信息
    getCategoryList() {
      this.$axios.get("/system/category/list").then((response) => {
        let categorys = response.data.data.records;
        categorys.forEach((item) => {
          let category = {};
          category.value = item.id;
          category.label = item.name;
          this.categoryList.push(category);
        });
        console.log("categorys", categorys);
        console.log("categoryList", this.categoryList);
      });
    },

    // 图片的上传
    handleAvatarSuccess(res, file) {
      // console.log(res.data);
      // this.url = res.data; //存储到Java项目中图片的路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.bookForm.cover = res.data;
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

    getBookList() {
      // 获的所有用户的信息
      this.$axios
        .get("/system/book/list", {
          params: {
            name: this.searchForm.bookname,
            categoryId: this.searchForm.categoryId,
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
    deleteBook(id) {
      // 删除一个或批量删除用户的方法
      // 如果时删除单个的话，会传递一个id进来。如果没有，则是删除多个
      let bookIds = [];
      id
        ? bookIds.push(id)
        : this.selection.forEach((item) => {
            bookIds.push(item.id);
          });
      console.log(bookIds);
      this.$axios.post("/system/book/delete", bookIds).then((response) => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
          onClose: () => {
            // 删除成功之后，重新请求用户列表
            this.getBookList();
          },
        });
      });
    },
    selectionChange(val) {
      //复选框选中的事件
      this.selection = val;
      this.deleteBtnStu = this.selection.length == 0;
    },
    editBook(id) {
      // 编辑用户
      this.$axios.get("/system/book/info/" + id).then((response) => {
        this.bookForm = response.data.data;
        this.dialogFormVisble = true;
      });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getBookList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getBookList();
    },

    submitBookForm(formName) {
      this.$refs[formName].validate((valid) => {
        // 根据bookForm判断是更新还是添加，
        if (valid) {
          this.$axios
            .post(
              "/system/book/" + (this.bookForm.id ? "update" : "save"),
              this.bookForm
            )
            .then((response) => {
              if ((response.data.code = 200)) {
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success",
                  onClose: () => {
                    //重新请求用户列表
                    this.getBookList();
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
      this.bookForm = { cover: "" };
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