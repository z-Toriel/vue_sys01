<template>
  <div>
    <!-- 工具栏 -->
    <el-form ref="form" :model="searchForm" label-width="80px" inline>
      <el-form-item>
        <el-input
          v-model="searchForm.name"
          placeholder="请输入搜索的名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getRoleList()">搜索</el-button>
        <!-- TODO:新建需要进行权限验证 -->
        <el-button type="primary" @click="dialogFormVisble = true"
          >新建</el-button
        >
        <template>
          <el-popconfirm title="确定删除吗？" @confirm="deleteRole()">
            <el-button slot="reference" type="danger" :disabled="deleteBtnStu"
              >批量删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-form-item>
    </el-form>
    <!-- 角色表格数据 -->
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
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="唯一编码" prop="code"></el-table-column>
      <el-table-column label="描述" prop="remark"></el-table-column>
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

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="permRole(scope.row.id)"
            >分配权限</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="editRole(scope.row.id)"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="deleteRole(scope.row.id)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 
      @size-change：当页面数据发送变化的时候触发
      @current-change：当页码被点击触发的事件
      current-page：当前显示的是第几页
      page-size：一页显示的记录数
      total：一共的记录数
      layout: 表示下面的控件
    -->
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

    <!-- 新建或编辑角色对话框 -->
    <el-dialog
      title="角色信息"
      :visible.sync="dialogFormVisble"
      width="600px"
      @closed="resetForm('roleForm')"

    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="唯一编码" prop="code">
          <el-input v-model="roleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="roleForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="roleForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('roleForm')">取 消</el-button>
        <el-button type="primary" @click="submitRoleForm('roleForm')">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="permDialogFormVisble"
      width="600px"
      @closed="resetForm('permForm')"
    >
      <el-form ref="permForm" :model="permForm" label-width="80px">
        <!-- props就是树型控件的关键 -->
        <el-tree
          ref="permTree"
          :data="permTreeData"
          node-key="id"
          :props="defaultProps"
          show-checkbox
          :default-expand-all="true"
          :check-strictly="true"
        >
        </el-tree>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('permForm')">取消</el-button>
        <el-button type="primary" @click="submitPerForm('permForm')"
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
      // 树形控件：读取数据的设置(指定树形控件如何从permTreeData取数据)
      defaultProps: {
        label: "name", //从返回的菜单列表数据中，取对应属性值
        children: "children", //从返回的菜单列表中，取对应的属性值,取children就是子菜单项目
      },
      deleteBtnStu: true,
      dialogFormVisble: false,
      permDialogFormVisble: false,
      searchForm: {}, //需要搜索的数据对象
      permForm: {}, // 权限分配的表单，数据对象
      roleForm: {}, // 新建角色的
      permTreeData: [], //树形控件的权限基础数据
      tableData: [],
      current: 1, //分页，当前页码
      size: 10, //分页 一页显示多少条数据，默认10
      total: 0, //分页 所有角色的记录数
      selection: [], // 用于保存批量删除的行
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  }, // data end
  created() {
    this.getRoleList();
  },
  methods: {
    selectionChange(val) {
      // val参数就是行对象
      this.selection = val;
      // 如果批量删除数组中有值,批量删除按钮设置为可用
      this.deleteBtnStu = this.selection.length == 0;
    },
    // 页面加载时，调用该方法显示所有角色信息，搜索进行模糊查询，设置模糊查询条件，重新加载页面的角色信息
    getRoleList() {
      // 请求服务器端：/system/role/list 获取所有角色信息
      this.$axios
        .get("/system/role/list", {
          params: {
            name: this.searchForm.name, // 搜索栏的信息
            // :当前的页码
            current: this.current,
            // 一页显示多少条
            size: this.size,
          },
        })
        .then((response) => {
          this.tableData = response.data.data.records;
          // TODO:赋值分页信息
          this.total = response.data.data.total; // 赋值总记录数
          this.size = response.data.data.size; //赋值一页显示多少行
          this.current = response.data.data.current; //赋值当前页面
        });

      // :获取权限树形控件的基础数据
      this.$axios.get("/system/menu/list").then((response) => {
        this.permTreeData = response.data.data;
      });
    },

    editRole(id) {
      this.$axios.get("/system/role/info/" + id).then((response) => {
        this.roleForm = response.data.data;
        this.dialogFormVisble = true;
      });
    },
    // 删除与批量删除
    deleteRole(id) {
      // 如果有id,就表示删除一个,如果没有id值,代表就是批量删除
      let roleIds = []; //用于存储批量删除的角色的编号
      id
        ? roleIds.push(id)
        : this.selection.forEach((val) => {
          //val是一行的整个对象，我们只需要id即可
            roleIds.push(val.id);
          });
      console.log(roleIds);
      this.$axios.post("/system/role/delete", roleIds).then((response) => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
          onClose: () => {
            this.getRoleList();
          },
        });
      });
    },

    permRole(id) {
      // 分配权限的方法，需要将权限分配给哪个角色(传参id来表示)
      // 步骤1.读取当前设定的用户的权限信息 /system/role/info/*
      this.$axios.get("/system/role/info/" + id).then((response) => {
        console.log(response.data.data.menuIds);
        // 读取出来的就是菜单编号:11,12,13,树形控件中:设置node-key就是菜单编号
        this.$refs["permTree"].setCheckedKeys(response.data.data.menuIds);
        this.permForm = response.data.data;
      });

      // 步骤2.显示对话框
      this.permDialogFormVisble = true;
    },

    handleSizeChange(val) {
      // 更改页面显示多少条记录
      this.size = val
      this.getRoleList() // 修改size之后重新加载页面数据
    },

    handleCurrentChange(val) {
      // 点击页面进行翻页，这个val就是页码
      this.current = val
      this.getRoleList() // 修改了页码之后，重新加载页面数据
    },

    handleClose() {
      this.resetForm("roleForm");
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields(); // 重置
      this.permForm = {}; // 清空权限设置对话框的表单对象
      this.roleForm = {};
      this.dialogFormVisble = false;
      this.permDialogFormVisble = false;
    },

    submitPerForm(formName) {
      var menuIds = this.$refs.permTree.getCheckedKeys();
      this.$axios
        .post("/system/role/perm/" + this.permForm.id, menuIds)
        .then((response) => {
          this.$message({
            showClose: true,
            message: "权限信息设置成功",
            type: "success",
            onClose: () => {
              this.getRoleList();
            },
          });

          // 权限设置完成之后,权限设置的对话框隐藏
          this.permDialogFormVisble = false;
          // 表单重置
          this.resetForm("permForm");
        });
    },

    submitRoleForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/system/role/" + (this.roleForm.id ? "update" : "save"),
              this.roleForm
            )
            .then((response) => {
              this.$message({
                showClose: true,
                message: "添加角色成功",
                type: "success",
                onClose: () => {
                  // 添加菜单之后，新增了一个菜单，所以要重新请求加载菜单数据
                  this.getRoleList();
                  
                },
              });
              // 添加操作成功之后，对话框需要隐藏起来,并将其数据清空
              this.dialogFormVisble = false;
              // this.roleForm = {};
            });
        } else {
          return false;
        }
      });
    },
  }, //methods end
};
</script>

<style>
</style>