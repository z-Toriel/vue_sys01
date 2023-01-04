<template>
  <div>
    <el-form label-width="80px" inline>
      <el-form-item>
        <!-- 添加权限编码检查，是否有权限添加菜单 -->
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 菜单数据的管理表格 -->
    <!-- :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->
    <el-table
      :data="tableData"
      stripe
      border
      default-expand-all
      row-key="id"
      :cell-style="{ padding: 2 }"
      style="width: 100%; margin-bottom: 20px"
    >
      <el-table-column sortable prop="name" label="名称" width="180">
      </el-table-column>
      <el-table-column prop="perms" label="权限编码" width="180">
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标"> </el-table-column>
      <!-- 菜单类型显示 0目录 1菜单 2按钮 -->
      <el-table-column prop="type" label="菜单类型">
        <!--slot-scope="scope" scope.row代表的就是循环时的每一行数据 -->
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.type == 0">目录</el-tag>
            <el-tag v-else-if="scope.row.type == 1" type="success">菜单</el-tag>
            <el-tag v-else-if="scope.row.type == 2" type="warning">按钮</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="菜单链接"> </el-table-column>
      <el-table-column prop="component" label="菜单组件"> </el-table-column>
      <el-table-column prop="orderNum" label="排序号"> </el-table-column>
      <el-table-column prop="statu" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu == 1" type="success" size="mini"
            >正常</el-tag
          >
          <el-tag v-else-if="scope.row.statu == 0" type="danger" size="mini"
            >禁用</el-tag
          >
        </template>
      </el-table-column>
      <!-- 编辑和删除都需要当前行的数据 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editeMenu(scope.row.id)"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="deleteMenu(scope.row.id)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增菜单的对话框 -->
    <!-- visible.sync是否显示 -->
    <el-dialog
      title="菜单"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        :model="menuForm"
        :rules="menuFromRules"
        ref="menuForm"
        label-width="80px"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="menuForm.parentId" placeholder="请选择上级菜单">
            <el-option label="/" value="0" />
            <template v-for="item in tableData">
              <el-option :key="item.id" :label="item.name" :value="item.id">
                <span>{{ item.name }}</span>
              </el-option>
              <!-- 二级菜单 -->
              <el-option
                v-for="child in item.children"
                :key="child.id"
                :label="child.name"
                :value="child.id"
              >
                <span>{{ "->" + child.name }}</span>
              </el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="权限编码" prop="perms">
          <el-input v-model="menuForm.perms" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标">
          <el-input v-model="menuForm.icon" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单URL">
          <el-input v-model="menuForm.path" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单组件">
          <el-input v-model="menuForm.component" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="menuForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="menuForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="menuForm.orderNum"></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('menuForm')"
            >保存菜单</el-button
          >
          <el-button @click="resetForm('menuForm')">重置菜单</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, // 新增菜单对话框是否显示 false不显示 true显示
      tableData: [], // 菜单表格显示的数据
      menuForm: {}, //新建或编辑菜单的数据对象
      menuFromRules: {
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入名字", trigger: "blur" }],
        perms: [{ required: true, message: "请输入权限编码", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
        orderNum: [
          { required: true, message: "请选择排序号", trigger: "blur" },
        ],
      }, //新建和编辑的表单规则
    };
  }, // data end
  created() {
    this.getMenus();
  }, // created end
  methods: {
    // 获取菜单数据
    getMenus() {
      this.$axios.get("/system/menu/list").then((response) => {
        this.tableData = response.data.data;
        console.log("this.tableData", this.tableData);
      });
    },

    editeMenu(id) {
      // 编辑
      // 1.通过一行数据的id，查询该菜单的信息，将数据在对话框中显示
      // 2.更新信息
      this.$axios.get("/system/menu/info/" + id).then((response) => {
        this.menuForm = response.data.data; // 第一步
        this.dialogVisible = true;
      });
    },

    deleteMenu(id) {
      // 删除
      // 传参采用RestFul
      this.$axios.post("/system/menu/delete/" + id).then((response) => {
        if (response.data.code == 200) {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
            onClose: () => {
              // 删除菜单之后，关闭成功的提示框,重新加载菜单的数据
              this.getMenus();
              this.resetForm('menuForm')
            },
          });
        }
      });
    },

    // 关闭对话框的方法
    handleClose() {
      this.resetForm("menuForm");
    },

    // 提交对话框
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // vaind为true表示验证通过
        if (valid) {
          // 因为添加和编辑菜单使用是同一个对话框，所以提交的服务端地址的时候需要判断
          this.$axios
            //请求服务端查询一行菜单的信息，会将id号传递回来，如果是新增的话则没有id号。
            .post(
              "/system/menu/" + (this.menuForm.id ? "update" : "save"),
              this.menuForm
            )
            .then((response) => {
              this.$message({
                showClose: true,
                message: "添加菜单成功",
                type: "success",
                onClose: () => {
                  // 添加菜单之后，新增了一个菜单，所以要重新请求加载菜单数据
                  this.getMenus();
                },
              });
              // 添加操作成功之后，对话框需要隐藏起来,并将其数据清空
              this.dialogVisible = false;
              this.menuForm = {};
            });
        } else {
          return false;
        }
      });
    },

    // 重置新建或编辑对话框的方法
    resetForm(formName) {
      this.$refs[formName].resetFields(); //重置表单
      this.dialogVisible = false;
      this.menuForm = {};
    },
  }, //methods end
};
</script>

<style>
</style>