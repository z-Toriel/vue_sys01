<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.bname"
          placeholder="请输入书籍名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchForm.uname"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchForm.statuCode"
          filterable
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in statuCodeList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- <el-input v-model="bookForm.category"></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-button @click="getBorrowList()">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      stripe
      border
      default-expand-all
      :cell-style="{ padding: 2 }"
      style="width: 100%; margin-bottom: 20px"
    >
      <el-table-column label="借阅ID" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="uname"></el-table-column>
      <el-table-column label="书籍名" prop="bname"></el-table-column>
      <el-table-column label="借阅日期" prop="borrowDate"></el-table-column>
      <el-table-column label="归还期限" prop="returnDate"></el-table-column>
      <el-table-column label="归还日期" prop="realReturnDate"></el-table-column>
      <el-table-column label="赔偿金额" prop="compensation"></el-table-column>

      <el-table-column label="状态" prop="statu">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu == 0" size="mini">正在借阅</el-tag>
          <el-tag v-else-if="scope.row.statu == 1" type="success" size="mini"
            >正常还书</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 2" type="info" size="mini"
            >逾期还书</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 3" type="warning" size="mini"
            >书籍破损</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 4" type="danger" size="mini"
            >书籍丢失</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope" v-if="scope.row.statu == 0">
          <template v-if="isNormal(scope.row.returnDate)">
            <el-popconfirm
              title="确定归还该书籍吗？"
              @confirm="normalReturn(scope.row.id)"
            >
              <el-button slot="reference" type="text" style="color: #67c23a"
                >正常归还</el-button
              >
            </el-popconfirm>
            <el-divider direction="vertical"></el-divider>
          </template>

          <template v-if="isOverdue(scope.row.returnDate)">
            <el-popconfirm
              title="确定归还该书籍吗？"
              @confirm="overdue(scope.row.id, scope.row.returnDate)"
            >
              <el-button slot="reference" type="text" style="color: #909399"
                >逾期归还</el-button
              >
            </el-popconfirm>
            <el-divider direction="vertical"></el-divider>
          </template>

          <template>
            <el-popconfirm
              title="以破损的方式归还该书籍？"
              @confirm="breakReturn(scope.row.id)"
            >
              <el-button slot="reference" type="text" style="color: #e6a23c"
                >书籍破损</el-button
              >
            </el-popconfirm>
            <el-divider direction="vertical"></el-divider>
          </template>

          <template>
            <el-popconfirm
              title="确定该书籍已经丢失？"
              @confirm="lost(scope.row.id)"
            >
              <el-button slot="reference" type="text" style="color: #f56c6c"
                >书籍丢失</el-button
              >
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
      @closed="resetForm('borrowForm')"
    >
      <el-form
        ref="borrowForm"
        :model="borrowForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="borrowForm.uid"></el-input>
        </el-form-item>
        <el-form-item label="书籍id" prop="bid">
          <el-input v-model="borrowForm.bid"></el-input>
        </el-form-item>
        <!-- <el-form-item label="借阅日期" prop="borrowDate">
          <el-date-picker
            v-model="borrowForm.borrowDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="借阅天数" prop="days">
          <el-input-number
            v-model="borrowForm.days"
            :min="1"
            :max="7"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('borrowForm')">取 消</el-button>
        <el-button type="primary" @click="submitborrowForm('borrowForm')">
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
      tableData: [], // 表格中的数据
      current: 1,
      size: 10,
      total: 0,
      borrowForm: {}, // 用于保存添加或修改用户的信息
      statuCodeList:[
        {label:"正在借阅",value:"0"},
        {label:"正常还书",value:"1"},
        {label:"逾期还书",value:"2"},
        {label:"书籍丢失",value:"3"},
        {label:"书籍破损",value:"4"},
      ],
      rules: {
        uid: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        bid: [{ required: true, message: "请输入书籍id", trigger: "blur" }],
        days: [{ required: true, message: "请输入借阅天数", trigger: "blur" }],
      },
    };
  }, // dataend
  created() {
    this.getBorrowList();
  },
  methods: {
    getBorrowList() {
      //获取订单列表
      this.$axios
        .get("/system/borrow/list", {
          params: {
            bname: this.searchForm.bname,
            uname: this.searchForm.uname,
            statuCode: this.searchForm.statuCode,
            current: this.current,
            size: this.size,
          },
        })
        .then((response) => {
          console.log("reponse的结果Borrow:", response);
          this.tableData = response.data.data.records;
          this.size = response.data.data.size;
          this.current = response.data.data.current;
          this.total = response.data.data.total;
        });
    },

    // 正常还书
    normalReturn(id) {
      // 编辑用户的方法
      console.log("用户id：", id);
      this.$axios.post("/system/borrow/normalReturn/" + id).then((response) => {
        console.log("response:", response);
        this.$message({
          showClose: true,
          message: "归还成功",
          type: "success",
          onClose: () => {
            //重新请求用户列表
            this.getBorrowList();
          },
        });
      });
    },

    // 逾期还书
    overdue(id, returnDate) {
      let now = new Date();
      returnDate = new Date(returnDate);
      const overdueDays = parseInt((now - returnDate) / (24 * 60 * 60 * 1000));
      this.$axios
        .post("/system/borrow/overdueReturn/" + id + "/" + overdueDays)
        .then((response) => {
          console.log("response:", response);
          this.$message({
            showClose: true,
            message: "归还成功",
            type: "success",
            onClose: () => {
              //重新请求用户列表
              this.getBorrowList();
            },
          });
        });
    },

    // 书籍破损
    breakReturn(id) {
      this.$axios.post("/system/borrow/breakReturn/" + id).then((response) => {
        console.log("response:", response);
        this.$message({
          showClose: true,
          message: "书籍归还成功（破损）",
          type: "warning",
          onClose: () => {
            //重新请求用户列表
            this.getBorrowList();
          },
        });
      });
    },

    // 书籍丢失
    lost(id) {
      this.$axios.post("/system/borrow/lost/" + id).then((response) => {
        console.log("response:", response);
        this.$message({
          showClose: true,
          message: "该书籍已丢失",
          type: "error",
          onClose: () => {
            //重新请求用户列表
            this.getBorrowList();
          },
        });
      });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getBorrowList();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.getBorrowList();
    },

    submitborrowForm(formName) {
      // 提交表单信息
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/system/borrow/save", this.borrowForm)
            .then((response) => {
              if (response.data.code == 200) {
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success",
                  onClose: () => {
                    //重新请求用户列表
                    this.getBorrowList();
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
      this.borrowForm = {};
      this.dialogFormVisble = false;
    },
    isOverdue(rdate) {
      let now = new Date();
      let returnDate = new Date(rdate);
      return now > returnDate;
      // return false;
    },
    isNormal(rdate) {
      let now = new Date();
      let returnDate = new Date(rdate);
      return now < returnDate;
    },
  }, // methods end
  computed: {},
};
</script>

<style>
</style>