<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.uname"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchForm.bname"
          placeholder="请输入书名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchForm.comment"
          placeholder="请输入评论内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getBookevaluateList()">搜索</el-button>
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteFilmevaluate()">
            <el-button slot="reference" type="danger" :disabled="deleteBtnStu"
              >批量删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-form-item>
    </el-form>

    <!-- 订单信息表 -->
    <!-- 
      stripe：是否为斑马纹 
      bfilmevaluate：是否有边框
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
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="图书" prop="bname"></el-table-column>
      <el-table-column label="用户名" prop="uname"></el-table-column>
      <el-table-column label="评分">
        <template slot-scope="scoped">
          <el-rate v-model="scoped.row.star"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" width="200px">
        <template slot-scope="scoped">
          <div class="test-ellipsis">
            {{scoped.row.comment}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <template>
            <el-popconfirm
              title="确定删除该评论吗？"
              @confirm="deleteFilmevaluate(scope.row.id)"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
      deleteBtnStu: true, // 批量删除的按钮是否使用
      tableData: [], // 表格中的数据
      current: 1,
      size: 10,
      total: 0,
      selection: [], // 用于保存批量删除的数据
    };
  }, // dataend
  created() {
    this.getBookevaluateList();
  },
  methods: {
    selectionChange(val) {
      //批量删除的change
      this.selection = val;
      this.deleteBtnStu = this.selection.length == 0;
    },
    getBookevaluateList() {
      //获取订单列表
      this.$axios
        .get("/system/booksEvaluate/list", {
          params: {
            uname: this.searchForm.uname,
            bname: this.searchForm.bname,
            comment: this.searchForm.comment,
            current: this.current,
            size: this.size,
          },
        })
        .then((response) => {
          console.log("response结果：", response);
          this.tableData = response.data.data.records;
          this.size = response.data.data.size;
          this.current = response.data.data.current;
          this.total = response.data.data.total;
        });
    },
    deleteFilmevaluate(id) {
      // 删除订单的方法
      let bookevaluateIds = [];
      id
        ? bookevaluateIds.push(id)
        : this.selection.forEach((item) => {
            bookevaluateIds.push(item.id);
          });
      console.log(bookevaluateIds);
      this.$axios
        .post("/system/booksEvaluate/delete", bookevaluateIds)
        .then((response) => {
          if (response.data.code == 200) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              onClose: () => {
                console.log("删除成功后执行的方法");
                this.getBookevaluateList();
              },
            });
          }
        });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getBookevaluateList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getBookevaluateList();
    },

    resetForm(formName) {
      //重置表单
      this.$refs[formName].resetFields(); // 重置
    },
  },
};
</script>

<style scoped>
.test-ellipsis{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>