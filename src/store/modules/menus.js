export default {
  state: {
    // 系统菜单数据
    menuList: [],

    // 系统权限数据
    permList: [],

    // 表示菜单是否已经加载过
    hasRoute: false,

    // 选项卡:记录当前激活的选项卡,选项卡的name
    editableTabsValue: 'Index', // 默认激活的是首页

    // 选项卡:记录所有打开的选项卡的内容和数量
    editableTabs: [ //默认只有一个首页的选项卡
      {
        title: '首页',
        name: 'Index',
      }
    ],

  },
  mutations: {
    // 设置存储菜单, 参数menus就是需要存到vuex中的菜单数据
    setMenuList(state, menus) {
      state.menuList = menus
      sessionStorage.setItem("menuList", JSON.stringify(menus)) // 存储到sessionStorage中,备份用
    },

    // 设置存储权限, 参数authoritys就是需要存到vuex中的权限数据
    setPermList(state, authoritys) {
      state.permList = authoritys
      sessionStorage.setItem("authoritys", JSON.stringify(authoritys)) // 存储到sessionStorage中,备份用
    },

    // 修改菜单加载状态
    changeRouterStatus(state, hasRoute) {
      state.hasRoute = hasRoute
      sessionStorage.setItem("hasRoute", hasRoute) // 存储到sessionStorage中,备份用
    },


    setActiveTab(state, tabName) {
      // 设置激活的选项卡,将激活的选项卡name赋值给editableTabValue
      state.editableTabsValue = tabName;
    },

    // 添加打开的选项卡到editableTabs数据中
    addTabs(state, tab) { // 参数tab就是需要添加的选项卡
      // 如果点击的菜单已经存在于数据中(已经打开),那么就不需要再次打开,只需要将它设置为激活的选项卡

      let index = state.editableTabs.findIndex((item) => {
        return item.name == tab.name
      })


      if (index == -1) {
        //如果没有找到,则添加选项卡到数组中
        state.editableTabs.push(tab)
        state.editableTabsValue = tab.name
      } else {
        // 如果已经存在,则激活
        state.editableTabsValue = tab.name
      }
    },

    // 清空menus
    resetState: state => {
      state.menuList = []
      state.permList = []
      state.hasRoute = false
      state.editableTabsValue = "Index"
      state.editableTabs = [
        {
          title: '首页',
          name: 'Index',
        }
      ]
    }
  },
  actions: {
  },
}