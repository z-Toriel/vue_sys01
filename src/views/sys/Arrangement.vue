<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.arrangementId"
          placeholder="请输入搜索的名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getArrangementList()">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteArrangement()">
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
      barrangement：是否有边框
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
      <el-table-column label="电影ID" prop="fid"></el-table-column>
      <el-table-column label="开放的座位" prop="seatNumber"></el-table-column>
      <el-table-column label="票房" prop="boxOffice"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
      <el-table-column label="上映日期" prop="data"></el-table-column>
      <el-table-column label="开始时间" prop="startTime"></el-table-column>
      <el-table-column label="结束时间" prop="endTime"></el-table-column>
      <el-table-column label="排片人" prop="founder"></el-table-column>
      <el-table-column label="创建时间" prop="created"></el-table-column>
      <el-table-column label="状态" prop="statu">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu == 1" type="success" size="mini"
            >正常</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 2" type="danger" size="mini"
            >禁用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="text" @click="editArrangement(scope.row.id)"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除该购物车内的物品吗？"
              @confirm="deleteArrangement(scope.row.id)"
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
      @closed="resetForm('arrangementForm')"
    >
      <el-form
        ref="arrangementForm"
        :model="arrangementForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="电影id" prop="fid">
          <el-input v-model="arrangementForm.fid"></el-input>
        </el-form-item>
        <el-form-item label="座位数" prop="seatNumber">
          <el-input v-model="arrangementForm.seatNumber"></el-input>
        </el-form-item>
        <el-form-item label="票房" prop="boxOffice">
          <el-input v-model="arrangementForm.boxOffice"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="arrangementForm.price"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="arrangementForm.type"></el-input>
        </el-form-item>
        <el-form-item label="上映日期" prop="data">
          <el-input v-model="arrangementForm.data"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
            v-model="arrangementForm.startTime"
            value-format="HH:mm:ss"
            placeholder="任意时间点"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker
            v-model="arrangementForm.endTime"
            value-format="HH:mm:ss"
            placeholder="任意时间点"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="arrangementForm.statu">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('arrangementForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitarrangementForm('arrangementForm')"
        >
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
      arrangementForm: {}, // 用于保存添加或修改用户的信息
      rules: {
        fid: [{ required: true, message: "请输入电影ID", trigger: "blur" }],
        seatNumber: [{ required: true, message: "请输入座位数", trigger: "blur" }],
        boxOffice: [{ required: true, message: "请输入票房", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
        data: [{ required: true, message: "请选择日期", trigger: "blur" }],
        startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
        endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
        founder: [{ required: true, message: "请选择排片人", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  }, // dataend
  created() {
    this.getArrangementList();
  },
  methods: {
    selectionChange(val) {
      //批量删除的change
      this.selection = val;
      this.deleteBtnStu = this.selection.length == 0;
    },
    getArrangementList() {
      //获取订单列表
      this.$axios
        .get("/system/arrangement/list", {
          params: {
            name: this.searchForm.arrangementId,
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
    deleteArrangement(id) {
      // 删除订单的方法
      let arrangementIds = [];
      id
        ? arrangementIds.push(id)
        : this.selection.forEach((item) => {
            arrangementIds.push(item.id);
          });
      console.log(arrangementIds);
      this.$axios
        .post("/system/arrangement/delete", arrangementIds)
        .then((response) => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
            onClose: () => {
              console.log("删除成功后执行的方法");
              this.getArrangementList();
            },
          });
        });
    },

    editArrangement(id) {
      // 编辑用户的方法
      console.log("用户id：", id);
      this.$axios.get("/system/arrangement/info/" + id).then((response) => {
        this.arrangementForm = response.data.data;
        this.dialogFormVisble = true;
      });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getArrangementList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getArrangementList();
    },

    submitarrangementForm(formName) {
      // 提交表单信息
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/system/user/" + (this.arrangementForm.id ? "update" : "save")
            )
            .then((response) => {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success",
                onClose: () => {
                  //重新请求用户列表
                  this.getArrangementList();
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
      this.arrangementForm = {};
      this.dialogFormVisble = false;
    },
  },
};
</script>

<style>
</style>