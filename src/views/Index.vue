<!-- <template>
  <div style="text-align:center">
    <h1>欢迎使用图书馆后台管理系统</h1>
    <el-image
      style="width: 100px; height: 100px"
      :src="require('@/assets/logo.webp')"
    ></el-image>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>

</style> -->

<template>
  <div>
    <el-container>
      <!-- 页面头部 -->

      <div class="box">
        <div>&nbsp;</div>
        <!-- 四个卡片 -->
        <el-row :gutter="40" class="topCard">
          <el-col :span="6">
            <el-card class="el-card-data">
              <div>
                <img src="../assets/fansIcon.png" alt="" style="width: 75px;">
                
                <p class="title-data">读者统计</p>
                <p class="title-dataQ">{{ fansNum }}</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6"><el-card class="el-card-data">
              <div>
                <img src="../assets/workerIcon.png" alt="" style="width: 75px;">
                <p class="title-data">工作人员统计</p>
                <p class="title-dataQ">{{ workerNum }}</p>
              </div>
            </el-card></el-col>
          <el-col :span="6"><el-card class="el-card-data">
              <div>
                <img src="../assets/bookIcon.png" alt="" style="width: 75px;">
                <p class="title-data">图书统计</p>
                <p class="title-dataQ">{{ booksNum }}</p>
              </div>
            </el-card></el-col>
          <el-col :span="6"><el-card class="el-card-data">
              <div>
                <img src="../assets/borrowIcon.png" alt="" style="width: 75px;">
                <p class="title-data">借阅统计</p>
                <p class="title-dataQ">{{ borrowNum }}</p>
              </div>
            </el-card></el-col>
        </el-row>
      </div>


      <el-main>
        <h1>main</h1>
        <el-card class="mianout">
          <!-- <div class="chart-container">
            <div id="chart1" class="chart1" style="height:500px;width:1000px" />
          </div> -->

          <template>
            <div style="width: 1400px;height: 400px;margin:auto" id="mainPic">
            </div>
          </template>

        </el-card>

        <!-- <div class="chart-container">
        <div id="chart2" class="chart2" style="height:500px;width:40%" />
      </div> -->
      </el-main>
      <el-footer>
        
      </el-footer>

    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      chart: null,
      xBar: [],
      yBar: [],
      fansNum: 0,
      workerNum: 0,
      borrowNum: 0,
      booksNum: 0,
    }
  },
  created() {
    this.getDataFans()
    this.getDataOrder()
    this.getDataFilms()
    this.getDataMoeny()



    this.getData1()
  },
  methods: {
    getData1() {
      this.$axios.get('/static/dayilyBorrow').then((response) => {
        this.xBar2 = response.data.data.date
        this.yBar2 = response.data.data.num
        console.log("/static/dayilyBorrow----------",response.data.data);
        // console.log( this.xBar);
        // console.log( this.yBar);
        this.echartsInit();
        // this.echartsInit2();
        // this.echartsInit3()

      })
    },

  

    //获取粉丝数量
    getDataFans() {
      this.$axios.get('/static/fansNum').then((response) => {
        this.fansNum = response.data.data
        // this.yBar = response.data.data.num

      })
    },

    //获取借阅数量
    getDataOrder() {
      this.$axios.get('/static/borrowNum').then((response) => {
        this.borrowNum = response.data.data
        // this.yBar = response.data.data.num

      })
    },
    //获取工作人员数量
    getDataFilms() {
      this.$axios.get('/static/workerNum').then((response) => {
        this.workerNum = response.data.data
        // this.yBar = response.data.data.num

      })
    },

    //获取图书数量
    getDataMoeny() {
      this.$axios.get('/static/booksNum').then((response) => {
        this.booksNum = response.data.data
        // this.yBar = response.data.data.num
        console.log(this.booksNum);


      })
    },





    //初始化echarts
    echartsInit() {
      //折现堆叠图图
      //因为初始化echarts 的时候，需要指定的容器 id='main'
      this.chart = this.$echarts.init(document.getElementById('mainPic'))

      var option = {
        title: {
          text: "统计每天借阅数量"
        },
        tooltip: {
          trigger: 'axis'
        },
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
        xAxis: {
          type: 'category',
          data: this.xBar2
        },
        // y轴是数据轴（连续数据）
        yAxis: {
          type: 'value'
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          // 系列中的数据内容数组
          data: this.yBar2,
          // data:[1，1]
          // 折线图
          type: 'line',
          itemStyle: {
            color: 'rgb(255, 70, 131)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)'
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }
            ])
          },
        }]
      }

      this.chart.setOption(option)
    },



    // 柱形图
    //初始化echarts
    echartsInit2() {
      //折现堆叠图图
      //因为初始化echarts 的时候，需要指定的容器 id='main'
      this.chart = this.$echarts.init(document.getElementById('mainPic2'))

      var option2 = {
        title: {
          text: "统计每天注册用户数量"
        },
        grid: {
          left: 60,
          right: 15,
          top: 10,
          bottom: 45,
          containLabel: false,
          backgroundColor: '#ffffff',
        },

        tooltip: {
          trigger: 'axis'
        },
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
        xAxis: {
          type: 'category',
          data: this.xBar
        },
        // y轴是数据轴（连续数据）
        yAxis: {
          type: 'value'
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          // 系列中的数据内容数组
          data: this.yBar,
          // data:[1，1]
          // 折线图
          type: 'bar', itemStyle: {
            color: 'rgb(112,128,144)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)'
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }
            ])
          },
        }]
      }

      this.chart.setOption(option2)
    },






    // 饼状图
    //初始化echarts
    echartsInit3() {
      //折现堆叠图图
      //因为初始化echarts 的时候，需要指定的容器 id='main'
      this.chart = this.$echarts.init(document.getElementById('mainPic3'))
      var option3 = {
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: '60%',
            center: ['50%', '30%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: this.pieDta
          }
        ]
      }

      this.chart.setOption(option3)
    }






  },

}
</script>

<style scoped>
.title-dataQ {
  font-weight: bold;
  /* font-family: "宋体"; */
  margin-top: -30px;
  margin-left: 195px;
  font-size: 35px;
}

.topCard .el-card-data {
  width: 350px;
  height: 120px;
}

.mianout {
  width: 1530px;
  margin: auto;
  height: 500px;
}


.box {
  height: 80%;
  /*overflow-y: auto;*/
  margin-top: 50px;
  margin-left: 17px;
  display: flex;
  flex-direction: column;
  /* 起作用的是这个，没有的话会变成下图的样子，卡片跑到右边去了 */
  margin: auto;

}

.footCard .el-card-data {
  width: 720px;
  height: 500px;
}

.title-data {
  margin-top: 4px;
  float: right;
  margin-right: 60px
}

.footBox {
  margin: auto;
  margin-left: 50px;
}
</style>