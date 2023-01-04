// axios全局的设置
import axios from 'axios'
import Element from 'element-ui'
import router from '@/router/index.js'
import { Promise } from 'core-js'

// 设置请求的根路径
axios.defaults.baseURL = '/api'
const myaxios = axios.create({
  timeout: 5000,  //设置超时时间
  // headers: {
  //   'content-type': 'application/json;charset=utf-8' // 服务器返回的数据类型
  // },
})

// 请求拦截器
// 设置axios的请求参数(vue前端到服务器设置)
myaxios.interceptors.request.use(config => {
  // 需要携带token,将登录获取的token放到请求头中
  config.headers['token'] = localStorage.getItem('token')
  return config
  // config.headers['token'] = localStorage.getItem('token')
  // return config
})

// 响应拦截器
// 设置axios的响应拦截器(服务器到vue前端设置)
// 所有的服务器响应都会被拦截，提前做响应
myaxios.interceptors.response.use(response => {
  let r_data = response.data //获得响应的数据
  console.log("r_data:",r_data)
  // response.status 和response.data.code是不一样的。前者是状态码，后者是后端存放的数据
  if (r_data.code === 200) {
    // 服务器响应成功
    // 成功，什么都不做，直接返回
    return response
  } else {
    // 弹窗提示错误信息
    Element.Message({
      showClose: true,
      message: r_data.message ? r_data.message : "系统异常",
      type: 'error'
    });

    return Promise.resolve(console.error.message);
  }
}, error => {
  console.log(error) //err表示没有请求成功
  Element.Message({
    showClose: true,
    message: error.message,
    type: 'error'
  });
  return Promise.reject(error)
})

export default myaxios
