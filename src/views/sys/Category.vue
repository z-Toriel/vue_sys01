<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.categoryname"
          placeholder="请输入搜索的名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getCategoryList()">搜索</el-button>
        <!-- TODO:新建需要进行权限验证 -->
        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteCategory()">
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
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="类型名" prop="name"></el-table-column>
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
          <el-button type="text" @click="editCategory(scope.row.id)"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除该类型吗？"
              @confirm="deleteCategory(scope.row.id)"
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

    <!-- 新增或编辑类型对话框 -->
    <el-dialog
      title="订单信息"
      :visible.sync="dialogFormVisble"
      width="600px"
      @closed="resetForm('categoryForm')"
    >
      <el-form
        ref="categoryForm"
        :model="categoryForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="书籍类型" prop="name">
          <el-input v-model="categoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="categoryForm.statu">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('categoryForm')">取 消</el-button>
        <el-button type="primary" @click="submitCategoryForm('categoryForm')">
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
      categoryForm: {}, // 用于保存添加或修改用户的信息
      test: {},
      rules: {
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  }, // data end
  created() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      // 获的所有的信息
      this.$axios
        .get("/system/category/list", {
          params: {
            name: this.searchForm.categoryname,
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
    deleteCategory(id) {
      // 删除一个或批量删除用户的方法
      // 如果时删除单个的话，会传递一个id进来。如果没有，则是删除多个
      let categoryIds = [];
      id
        ? categoryIds.push(id)
        : this.selection.forEach((item) => {
            categoryIds.push(item.id);
          });
      console.log(categoryIds);
      this.$axios
        .post("/system/category/delete", categoryIds)
        .then((response) => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
            onClose: () => {
              // 删除成功之后，重新请求列表
              this.getCategoryList();
            },
          });
        });
    },
    selectionChange(val) {
      //复选框选中的事件
      this.selection = val;
      this.deleteBtnStu = this.selection.length == 0;
    },
    editCategory(id) {
      // 编辑用户
      this.$axios.get("/system/category/info/" + id).then((response) => {
        this.categoryForm = response.data.data;
        this.dialogFormVisble = true;
      });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getCategoryList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getCategoryList();
    },

    submitCategoryForm(formName) {
      // debugger
      console.log(this.categoryForm);
      // this.dialogFormVisble = false
      // console.log("test",this.test)
      this.$refs[formName].validate((valid) => {
        // 根据categoryForm判断是更新还是添加，
        if (valid) {
          this.$axios
            .post(
              "/system/category/" + (this.categoryForm.id ? "update" : "save"),
              this.categoryForm
            )
            .then((response) => {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success",
                onClose: () => {
                  //重新请求列表
                  this.getCategoryList();
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
      console.log("categoryForm中的数据", this.categoryForm);
      this.$refs[formName].resetFields(); // 重置
      this.categoryForm = {};
      this.dialogFormVisble = false;
    },

    
  },
};
</script>


<style scoped>
.avatar {
  width: 80px;
}


</style>