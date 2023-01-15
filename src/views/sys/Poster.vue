<template>
  <div>
    <!-- 工具栏 -->
    <el-form :inline="true" :model="searchForm" ref="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.title" placeholder="请输入需要搜索的内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getPosterList">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisible = true">新建</el-button>
        <el-popconfirm title="确定要删除这些轮播图的数据吗?" @confirm="deletePoster()">
          <el-button type="danger" :disabled="deleteBtnStu" slot="reference">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <!-- 幻灯片表格 -->
    <el-table :cell-style="{ padding: '2px' }" :data="tableData" border default-expand-all stripe
      style="width: 100%; margin-bottom: 20px" @selection-change="selectionChange">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column prop="title" label="书籍名称"> </el-table-column>
      <el-table-column prop="url" label="书籍封面" width="200" sortable>
        <template slot-scope="scope">
          <el-image style="width: 200px; height: 120px" :src="scope.row.url" fit="url"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="statu" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.statu == 1" type="success">上架</el-tag>
          <el-tag size="mini" v-else-if="scope.row.statu == 0" type="danger">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created" label="创建时间" type="date" width="350">
      </el-table-column>
      <el-table-column prop="updated" label="修改时间" type="date" width="350">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" plain @click="editPoster(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <template>
            <el-popconfirm title="确定要删除该幻灯片的数据吗?" @confirm="deletePoster(scope.row.id)">
              <el-button slot="reference" type="danger" plain>删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div class="el-pagination"></div>
    <!-- 页码 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
      :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>


    <!-- 新增或编辑幻灯片对话框 -->
    <el-dialog title="轮播图信息" :visible.sync="dialogFormVisible" width="600px" @close="resetForm('PosterForm')">
      <el-form :model="PosterForm" :rules="PosterFormRules" ref="PosterForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="上传书籍封面">
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers">
            <img v-if="PosterForm.url" :src="PosterForm.url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="书籍名称" label-width="100px" prop="title">
          <el-input v-model="PosterForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="PosterForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPosterForm('PosterForm')">确定</el-button>
          <el-button @click="resetForm('PosterForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type='text/javascript'>
export default {
  data() {
    return {
      //修改前台 banner对话框
      dialogPosterVisible: false,
      previewList: [],
      //图像地址
      imageUrl: "",
      imagecropperKey: 0,
      headers: {
        token: localStorage.getItem("token"),
      },
      //搜索栏对象
      searchForm: {},
      //新建与编辑幻灯片对话框是否显示
      dialogFormVisible: false,
      //幻灯片分配轮播图对话框
      bannerDialogFormVisible: false,
      //给幻灯片分配的轮播图表单对象
      bannerForm: {},
      //新建幻灯片或编辑幻灯片对话框表单对象
      PosterForm: {url:""},
      //分配轮播图,轮播图树状控件数据
      bannerData: [],
      //批量删除的按钮是否可用
      deleteBtnStu: true,
      //幻灯片表格的数据
      tableData: [],
      posterIds: [],
      current: 1, //分页:当前页码
      size: 10, //一页显示多少条数据,默认显示10条
      total: 0, //分页：所有的轮播图记录数
      //批量删除变量：存储需要删除的行
      selection: [],
      //新建或编辑轮播图信息菜单的验证
      PosterFormRules: {
        title: [{ required: true, message: "请输入书籍名称", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getPosterList();
  },
  methods: {
    getBannerData(){

    },

    // 图片的上传
    handleAvatarSuccess(res, file) {
      // console.log(res.data);
      // this.url = res.data; //存储到Java项目中图片的路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log("res", res)
      this.PosterForm.url = res.data;
      this.PosterForm.statu = 1;
      console.log("this.PosterForm.url", this.PosterForm.url)
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

    //获得所有幻灯片的信息
    getPosterList() {
      console.log("111111111");
      console.log(this.searchForm.title);
      //获得幻灯片信息
      this.$axios
        .post("/system/poster/list/", {
          params: {
            name: this.searchForm.title, //搜索栏里的搜索名称
            //TODO:当前的页码
            current: this.current,
            size: this.size,
            //TODO:一页显示多少
          },
        })
        .then((response) => {
          this.tableData = response.data.data.records;
          //  items是一个数组，将items数组拷贝到 perviewList
          for (var i = 0; i < response.data.data.records.length; i++) {
            //  push:是往数组末尾增加数据
            this.previewList.push(response.data.data.records[i].url);
            console.log("lllllpre" + this.previewList);
          }
          //赋值分页信息(页码需要这些数据)
          this.total = response.data.data.total; //赋值总记录数
          this.size = response.data.data.size; //赋值一页显示多少行
          this.current = response.data.data.current; //赋值当前页码
        });
    },

    //获得所有幻灯片的信息
    getPosterList() {
      //获得幻灯片信息
      this.$axios
        .get("/system/poster/list", {
          params: {
            name: this.searchForm.Postername, //搜索栏里的搜索名称
            //TODO:当前的页码
            current: this.current,
            size: this.size,
            //TODO:一页显示多少
          },
        })
        .then((response) => {
          this.tableData = response.data.data.records;
          //赋值分页信息(页码需要这些数据)
          this.total = response.data.data.total; //赋值总记录数
          this.size = response.data.data.size; //赋值一页显示多少行
          this.current = response.data.data.current; //赋值当前页码
        });
    },
    //删除一个或批量删除幻灯片的方法 参数:幻灯片编号
    deletePoster(id) {
      //如果有id,就表示一个一个删除,如果id没有值,代表就是批量删除
      var PosterIds = []; //存储要批量删除的轮播图编号
      id
        ? PosterIds.push(id)
        : this.selection.forEach((val) => {
          PosterIds.push(val.id);
        });
      this.$axios.post("/system/poster/delete", PosterIds).then((response) => {
        this.$message({
          showClose: true,
          message: "书籍信息删除成功",
          type: "success",
          onClose: () => {
            //重新加载 轮播图的列表信息 getbannerList()
            this.getPosterList();
          },
        });
      });
    },
    //复选框选中的事件
    selectionChange(val) {
      //val参数就是选中的对象
      this.selection = val;
      //如果批量删除的数组中有值,批量删除按钮设置为可用
      this.deleteBtnStu = this.selection.length == 0; //数组长度为0，表示没有选中复选数组,所以为true,按钮不可用,否则相反
    },

    //编辑幻灯片的方法
    editPoster(id) {
      //请求服务器,通过id查询该轮播图信息的方法: /system/banner/info/6
      this.$axios.get("/system/poster/info/" + id).then((response) => {
        this.PosterForm = response.data.data; //服务器返回的菜单详细数据,赋值给bannerForm(双向数据绑定,直接在对话框显示数据)
        this.dialogFormVisible = true; //设置为True，对话框显示
      });
    },

    handleSizeChange(val) {
      //val参数就是修改size之后的值
      this.size = val;
      this.getPosterList(); //修改size之后,重新加载页面的数据
    },
    //分页组件：点击页码进行翻页的事件方法
    handleCurrentChange(val) {
      //val参数
      this.current = val;
      this.getPosterList();
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields(); //重置
      this.bannerForm = {}; //清空 轮播图设置 对话框的表单对象
      this.PosterForm = {url:""}; //新建或编辑幻灯片对话框的表单对象
      this.dialogFormVisible = false;
      this.bannerDialogFormVisible = false;
    },

    //提交对话框 新建或编辑幻灯片信息菜单的表单 参数formName: 需要操作表单的名字 ref='名字'
    submitPosterForm(formName) {
      this.$refs[formName].validate((valid) => {
        //valid参数为true，表示表单中的验证规划规则通过
        if (valid) {
          //添加菜单和编辑菜单 使用的是同一个对话框 所以提交服务器端地址 需要判断是添加还是修改
          //新增一条菜单:服务器端: /system/Poster/save
          //编辑完毕更新菜单数据:服务器端 ：/system/Poster/update
          this.$axios
            .post(
              "/system/poster/" + (this.PosterForm.id ? "update" : "save"),
              this.PosterForm
            )
            .then((response) => {
              this.$message({
                showClose: true,
                message: "保存书籍信息成功",
                type: "success",
                onClose: () => {
                  //添加菜单之后,新增了一个菜单,所以重新请求加载菜单数据
                  this.getPosterList();
                },
              });
              //添加操作成功之后,对话框需要隐藏
              this.dialogFormVisible = false;
            });
        } else {
          //验证没有通过
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
.avatar {
  width: 200px;

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

.img {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
