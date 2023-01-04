<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.filmId"
          placeholder="请输入搜索的名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getFilmList()">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteFilm()">
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
      bfilm：是否有边框
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
      <el-table-column label="电影ID" prop="id"></el-table-column>
      <el-table-column label="电影名称" prop="name"></el-table-column>
      <el-table-column label="上映时间" prop="releaseTime"></el-table-column>
      <el-table-column label="电影类型" prop="type"></el-table-column>
      <el-table-column label="地区" prop="region"></el-table-column>
      <el-table-column label="热度" prop="hot"></el-table-column>
      <el-table-column label="电影介绍" prop="introduction"></el-table-column>
      <el-table-column label="电影时长" prop="duration"></el-table-column>
      <el-table-column label="海报" prop="cover" width="150px">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.cover"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statu">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu == 1" type="success" size="mini"
            >上架</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 2" type="danger" size="mini"
            >下架</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="text" @click="editFilm(scope.row.id)"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除该电影吗？"
              @confirm="deleteFilm(scope.row.id)"
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
      title="订单信息"
      :visible.sync="dialogFormVisble"
      width="600px"
      @closed="resetForm('filmForm')"
    >
      <el-form
        ref="filmForm"
        :model="filmForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="电影名称" prop="name">
          <el-input v-model="filmForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="filmForm.type"></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="region">
          <el-input v-model="filmForm.region"></el-input>
        </el-form-item>
        <el-form-item label="热度" prop="hot">
          <el-input v-model="filmForm.hot"></el-input>
        </el-form-item>
        <el-form-item label="电影时长" prop="duration">
          <el-input v-model="filmForm.duration"></el-input>
        </el-form-item>
        <el-form-item label="上映时间" prop="releaseTime">
          <el-date-picker
            v-model="filmForm.releaseTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="filmForm.statu">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电影介绍" prop="introduction">
          <el-input v-model="filmForm.introduction" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('filmForm')">取 消</el-button>
        <el-button type="primary" @click="submitfilmForm('filmForm')">
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
      filmForm: {}, // 用于保存添加或修改用户的信息
      rules: {
        name: [{ required: true, message: "请输入电影名称", trigger: "blur" }],
        releaseTime: [{ required: true, message: "请选择上映时间", trigger: "blur" }],
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
        region: [{ required: true, message: "请输入地区", trigger: "blur" }],
        hot: [{ required: true, message: "请输入热度", trigger: "blur" }],
        introduction: [{ required: true, message: "请输入简介", trigger: "blur" }],
        duration: [{ required: true, message: "请输入电影时长", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  }, // dataend
  created() {
    this.getFilmList();
  },
  methods: {
    selectionChange(val) {
      //批量删除的change
      this.selection = val;
      this.deleteBtnStu = this.selection.length == 0;
    },
    getFilmList() {
      //获取订单列表
      this.$axios
        .get("/system/film/list", {
          params: {
            name: this.searchForm.filmId,
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
    deleteFilm(id) {
      // 删除订单的方法
      let filmIds = [];
      id
        ? filmIds.push(id)
        : this.selection.forEach((item) => {
            filmIds.push(item.id);
          });
      console.log(filmIds);
      this.$axios.post("/system/film/delete", filmIds).then((response) => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
          onClose: () => {
            console.log("删除成功后执行的方法");
            this.getFilmList();
          },
        });
      });
    },

    editFilm(id) {
      // 编辑用户的方法
      console.log("用户id：", id);
      this.$axios.get("/system/film/info/" + id).then((response) => {
        this.filmForm = response.data.data;
        this.dialogFormVisble = true;
      });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getFilmList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getFilmList();
    },

    submitfilmForm(formName) {
      // 提交表单信息
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/system/film/" + (this.filmForm.id ? "update" : "save"))
            .then((response) => {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success",
                onClose: () => {
                  //重新请求用户列表
                  this.getFilmList();
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
      this.filmForm = {};
      this.dialogFormVisble = false;
    },
  },
};
</script>

<style>
</style>