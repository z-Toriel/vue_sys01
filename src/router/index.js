import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

import store from '../store'
import axios from '@/api/request.js'

//添加以下代码  解决路由跳转重复的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)





const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      { path: '/index', name: 'Index', component: () => import('@/views/Index.vue') },
      {
        path: '/pwd',
        name: 'Pwd',
        meta: {
          title:"修改密码",
        },
        component: () => import('@/views/Pwd.vue')
      }
    ]
  },
  
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  
]






const router = new VueRouter({
  mode: 'history',  // 路由地址中不带#
  routes
})



// 配置前置守卫, 动态的读取菜单的信息，根据菜单信息，动态的生成路由
router.beforeEach((to, from, next) => {
  let hasRoute = store.state.menus.hasRoute
  let token = localStorage.getItem('token')

  if (to.path == "/login") {
    next() // 放行
  } else if (!token) {
    next({ path: '/login' })  //如若没有token，跳转到登录页面
  } else if (!hasRoute) {
    // 没有加载过，执行下面代码
    // 1.从服务器，读取菜单信息
    axios.get("/menu/nav").then((response) => {
      store.commit("setMenuList", response.data.data.nav); // 将数据存储到vuex中
      store.commit('setPermList', response.data.data.authoritys); // 将权限数据存储到vuex中

      console.log("后端返回的菜单数据：",response.data.data.nav)
      console.log("后端返回的菜单权限：",response.data.data.authoritys)
      // debugger
      // 2.根据菜单信息，动态的生成路由
      // debugger
      response.data.data.nav.forEach((item) => {
        console.log("执行navforeach")
        if (item.children) {  // 如果当前item有子菜单，就递归调用menuToRoute方法
          item.children.forEach((child) => {  // 遍历子菜单
            
            let route = menuToRoute(child)  // 将子菜单转换为路由对象
            
            if (route) { // 如果route不为空，就将route添加到路由中
              routes[0].children.push(route)  // 将route添加到路由中
            }
          })
        }
      });

      // 3.将生成的路由，添加到路由中
      router.addRoutes(routes)  // 将routes添加到路由中
      store.commit('changeRouterStatus', true)  // 将hasRoute设置为true
      next({ path: to.path })
    });
  } else {
    next() // 放行,跳转至之前要去的地方
  }
})

// 添加方法，将菜单的信息，转换为路由的信息
const menuToRoute = (menu) => {
  if (!menu.component) {  // 判断当前菜单component是否有值
    return null;
  }
  // 定义一个路由对象
  let route = {
    path: menu.path,
    name: menu.name,
    meta: {
      title: menu.title,
      icon: menu.icon,
    },  // 路由元信息,用于存储菜单的信息。可以传递信息
    component: () => import(`@/views/${menu.component}.vue`)  // 动态的导入组件
  }
  console.log("route111111:",route)
  // 成功将路由配置对象完成
  return route
}




// 配置前置守卫


// router.beforeEach((to, from, next) => {
//   // 1.获取是否加载，获取是否有token,用户是否要跳转到登录页
//   let hasRoute = store.state.menus.hasRoute
//   let token = localStorage.getItem('token')

//   if(to.path=="/login"){
//     next()
//   }else if (!token){
//     next({path:"/login"})
//   }else if (!hasRoute){
//     // 如果没有加载过侧边栏。1.获取数据。2. 将数据存放到vuex中的menu中的muneList。3.根据数据动态生成路由。4.将加载改变ture表示以及加载过了。5.添加路由
//     // 1.获取数据
//     axios.get("/menu/nav").then((res) => {
//       let nav = res.data.data.nav
//       let authoritys = res.data.data.authoritys

//       // 2. 将数据存放到vuex中的menu中的muneList
//       store.commit("setMenuList",nav);
//       store.commit("setPermList",authoritys);

//       // 3. 动态生成路由
//       nav.forEach((item)=>{
//         if(item.children){
//           item.children.forEach((child)=>{
//             let route = navToroute(child)
//             if(route){
//               routes[0].children.push(route)
//             }
//           })
//         }
//       })

//       // 4. 将加载改变ture表示以及加载过了
//       store.commit("changeRouterStatus",true)
//       // 5.添加路由
//       router.addRoutes(routes)
//       // 6.放行
//       next({path: to.path})
//     })
//   }else {
//     next()
//   }

// })

// const navToroute = (menu)=>{
//   if (!menu.component){
//     return null;
//   }
//   let route = {
//     path: menu.path,
//     name: menu.name,
//     meta:{
//       title:menu.title,
//       icon:menu.icon
//     },
//     // component : () => import(`@/views/${menu.component}.vue`)
//   }

//   route.component = () => import(`@/views/${menu.component}.vue`)
//   console.log("route:",route);
//   return route
// }

export default router
