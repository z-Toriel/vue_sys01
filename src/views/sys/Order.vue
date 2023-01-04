<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.orderId"
          placeholder="请输入搜索的名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getOrderList()">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteOrder()">
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
      <el-table-column label="订单ID" prop="id"></el-table-column>
      <el-table-column label="用户ID" prop="uid"></el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column label="排片ID" prop="aid"></el-table-column>
      <el-table-column label="座位号" prop="seates"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="支付时间" prop="paid"></el-table-column>
      <el-table-column label="状态" prop="statu">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu == 0" type="success" size="mini"
            >等待支付</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 1" type="danger" size="mini"
            >支付失败</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 2" type="success" size="mini"
            >支付成功</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 3" type="info" size="mini"
            >已被撤销</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="text" @click="editOrder(scope.row.id)"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除该订单吗？"
              @confirm="deleteOrder(scope.row.id)"
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
      @closed="resetForm('orderForm')"
    >
      <el-form
        ref="orderForm"
        :model="orderForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="orderForm.uid"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="orderForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="排片ID" prop="aid">
          <el-input v-model="orderForm.aid"></el-input>
        </el-form-item>
        <el-form-item label="座位号" prop="seates">
          <el-input v-model="orderForm.seates"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="orderForm.price"></el-input>
        </el-form-item>
        <el-form-item label="支付时间" prop="paid">
          <el-date-picker
            v-model="orderForm.paid"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="orderForm.statu">
            <el-radio :label="0">等待支付</el-radio>
            <el-radio :label="1">支付失败</el-radio>
            <el-radio :label="2">支付成功</el-radio>
            <el-radio :label="3">已被撤销</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('orderForm')">取 消</el-button>
        <el-button type="primary" @click="submitorderForm('orderForm')">
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
      orderForm: {}, // 用于保存添加或修改用户的信息
      rules: {
        uid: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        aid: [{ required: true, message: "请输入排片id", trigger: "blur" }],
        seates: [{ required: true, message: "请输入座位号", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        paid: [{ required: true, message: "请选择支付时间", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  }, // dataend
  created() {
    this.getOrderList();
  },
  methods: {
    selectionChange(val) {
      //批量删除的change
      this.selection = val;
      this.deleteBtnStu = this.selection.length == 0;
    },
    getOrderList() {
      //获取订单列表
      this.$axios
        .get("/system/order/list", {
          params: {
            name: this.searchForm.orderId,
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
    deleteOrder(id) {
      // 删除订单的方法
      let orderIds = [];
      id
        ? orderIds.push(id)
        : this.selection.forEach((item) => {
            orderIds.push(item.id);
          });
      console.log(orderIds);
      this.$axios.post("/system/order/delete", orderIds).then((response) => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
          onClose: () => {
            console.log("删除成功后执行的方法")
            this.getOrderList();
          },
        });
      });
    },

    editOrder(id) {
      // 编辑用户的方法
      console.log("用户id：", id);
      this.$axios.get("/system/order/info/" + id).then((response) => {
        this.orderForm = response.data.data;
        this.dialogFormVisble = true;
      });
    },


    handleSizeChange(val) {
      this.size = val;
      this.getOrderList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getOrderList();
    },

    submitorderForm(formName) {
      // 提交表单信息
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/system/user/" + (this.orderForm.id ? "update" : "save"))
            .then((response) => {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success",
                onClose: () => {
                  //重新请求用户列表
                  this.getOrderList();
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
      this.orderForm = {};
      this.dialogFormVisble = false;
    },
  },
};
</script>

<style>
</style>