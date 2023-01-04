import Vue from 'vue'
import Vuex from 'vuex'
import menus from './modules/menus.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // store/moudles/menus.js运行时，会将state的数据合并为一个
  state: {
    token: '',  //要存储的状态变量
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      // 存储token到localStorage中
      state.token = token
      localStorage.setItem('token', token)
    }
  },
  actions: {
  },
  modules: {
    menus,
  }
})
