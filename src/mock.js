//引入mockjs
const Mock = require('mockjs')

//模拟验证码响应
const Random = Mock.Random //获得mock.Random对象

//服务器返回数据的结构：
let Result = {
  code: 200, //响应返回状态码
  message: '操作成功', //响应操作的结果信息
  data: null, //响应的数据
}

//验证码模拟响应:   /captcha代表服务器验证码的控制器方法路径
Mock.mock('/captcha', 'get', () => {
  console.log('mockjs验证码')
  //模拟生成数据：验证码
  Result.data = {
    key: Random.toString(32), //获取一个32位的随机码字符串,
    captchaImg: Random.dataImage('120x40', '7fa5w'), //生成验证码是7fa5w 的base64图片编码
  }
  return Result
})

//模拟登录响应：
//服务器端传参：RestFUL： http://localhost:10001/system/login/username/123
//传统请求传参： http://localhost:10001/system/login?username=st&password=123
// 方法/login*使用正则表达式 匹配所有
Mock.mock('/login', 'post', () => {
  // Result.code = 10002
  // Result.message = '用户名或者密码不正确'
  return Result //登录成功
})

////退出用户
Mock.mock('/logout', 'post', () => {
  return Result //退出用户操作成功
})

//返回用户信息的响应
Mock.mock('/user/userInfo', 'get', () => {
  //响应的用户信息
  Result.data = {
    id: '1',
    username: 'admin',
    avatar:
      'https://img1.baidu.com/it/u=1811445190,4171898561&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  }
  return Result
})

//模拟，修改用户的密码
Mock.mock('/system/user/updatePwd', 'post', () => {
  return Result
})

//模拟服务器菜单数据的响应
Mock.mock('/menu/nav', 'get', () => {
  //菜单JSON，从Menu表中查询出来。
  let menu_json = [
    {
      id: 1,
      name: 'sys:manage',
      title: '系统管理',
      icon: 'el-icon-s-operation',
      path: '', //点击菜单后  路由跳转的地址
      component: '', //路由跳转地址对应的组件
      children: [
        {
          id: 2,
          name: 'sys:user:list',
          title: '用户管理',
          icon: 'el-icon-s-custom',
          path: '/sys/users',
          component: 'sys/User', //src/views/sys/User.vue  加载到该User.vue组件
          children: [],
        },
        {
          id: 3,
          name: 'sys:role:list',
          title: '角色管理',
          icon: 'el-icon-rank',
          path: '/sys/roles',
          component: 'sys/Role', //src/views/sys/Role.vue  加载到该Role.vue组件
          children: [],
        },
        {
          id: 4,
          name: 'sys:menu:list',
          title: '菜单管理',
          icon: 'el-icon-s-custom',
          path: '/sys/menus',
          component: 'sys/Menu', //src/views/sys/Menu.vue  加载到该Menu.vue组件
          children: [],
        },
      ],
    },
    {
      id: 5,
      name: 'sys:tools',
      title: '系统工具',
      icon: 'el-icon-s-tools',
      path: '',
      component: '',
      children: [
        {
          id: 6,
          name: 'sys:data:list',
          title: '数据管理',
          icon: 'el-icon-s-order',
          path: '/sys/data',
          component: 'sys/Data', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        },
        {
          id: 15,
          name: 'sys:upload:list',
          title: '文件上传',
          icon: 'el-icon-s-order',
          path: '/sys/upload',
          component: 'sys/Upload', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        },
        {
          id: 16,
          name: 'sys:poster:list',
          title: '轮播图管理',
          icon: 'el-icon-s-order',
          path: '/sys/poster',
          component: 'sys/Poster', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        }
      ],
    },
    {
      id: 7,
      name: 'sys:cus',
      title: '用户管理',
      icon: 'el-icon-s-tools',
      path: '',
      component: '',
      children: [
        {
          id: 8,
          name: 'sys:cus:list',
          title: '用户信息',
          icon: 'el-icon-s-order',
          path: '/sys/cus',
          component: 'sys/Cus', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        },
        {
          id: 9,
          name: 'sys:order:list',
          title: '订单管理',
          icon: 'el-icon-s-order',
          path: '/sys/order',
          component: 'sys/Order', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        },
        {
          id: 10,
          name: 'sys:cart:list',
          title: '购物车管理',
          icon: 'el-icon-s-order',
          path: '/sys/cart',
          component: 'sys/Cart', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        },
      ],
    },
    {
      id: 11,
      name: 'sys:film',
      title: '电影管理',
      icon: 'el-icon-s-tools',
      path: '',
      component: '',
      children: [
        {
          id: 12,
          name: 'sys:film:list',
          title: '电影管理',
          icon: 'el-icon-s-order',
          path: '/sys/film',
          component: 'sys/Film', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        },
        {
          id: 13,
          name: 'sys:filmevaluate:list',
          title: '电影评论管理',
          icon: 'el-icon-s-order',
          path: '/sys/filmevaluate',
          component: 'sys/FilmEvaluate', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        },
        {
          id: 14,
          name: 'sys:arrangement:list',
          title: '排片管理',
          icon: 'el-icon-s-order',
          path: '/sys/arrangement',
          component: 'sys/Arrangement', //src/views/sys/Data.vue  加载到该Data.vue组件
          children: [],
        },
      ],
    },
  ]

  //权限的限定数据
  let authoritys = ['sys:manage', 'sys:user:list']
  Result.data = {}
  Result.data.nav = menu_json //将菜单数据赋值给Result.data
  Result.data.authoritys = authoritys //返回惨淡的权限限定数据
  return Result
})

//模拟： 响应获得菜单的数据  仔细阅读
Mock.mock('/system/menu/list', 'get', () => {
  let menus = [
    {
      id: 1,
      created: '2021-01-15T18:58:18',
      updated: '2021-01-15T18:58:20',
      statu: 1,
      parentId: 0,
      name: '系统管理',
      path: '',
      perms: 'sys:manage',
      component: '',
      type: 0,
      icon: 'el-icon-s-operation',
      ordernum: 1,
      children: [
        {
          id: 2,
          created: '2021-01-15T19:03:45',
          updated: '2021-01-15T19:03:48',
          statu: 1,
          parentId: 1,
          name: '用户管理',
          path: '/system/users',
          perms: 'sys:user:list',
          component: 'system/User',
          type: 1,
          icon: 'el-icon-s-custom',
          ordernum: 1,
          children: [
            {
              id: 9,
              created: '2021-01-17T21:48:32',
              updated: null,
              statu: 1,
              parentId: 2,
              name: '添加用户',
              path: null,
              perms: 'sys:user:save',
              component: null,
              type: 2,
              icon: null,
              ordernum: 1,
              children: [],
            },
            {
              id: 10,
              created: '2021-01-17T21:49:03',
              updated: '2021-01-17T21:53:04',
              statu: 1,
              parentId: 2,
              name: '修改用户',
              path: null,
              perms: 'sys:user:update',
              component: null,
              type: 2,
              icon: null,
              ordernum: 2,
              children: [],
            },
            {
              id: 11,
              created: '2021-01-17T21:49:21',
              updated: null,
              statu: 1,
              parentId: 2,
              name: '删除用户',
              path: null,
              perms: 'sys:user:delete',
              component: null,
              type: 2,
              icon: null,
              ordernum: 3,
              children: [],
            },
            {
              id: 12,
              created: '2021-01-17T21:49:58',
              updated: null,
              statu: 1,
              parentId: 2,
              name: '分配角色',
              path: null,
              perms: 'sys:user:role',
              component: null,
              type: 2,
              icon: null,
              ordernum: 4,
              children: [],
            },
            {
              id: 13,
              created: '2021-01-17T21:50:36',
              updated: null,
              statu: 0,
              parentId: 2,
              name: '重置密码',
              path: null,
              perms: 'sys:user:repass',
              component: null,
              type: 2,
              icon: null,
              ordernum: 5,
              children: [],
            },
          ],
        },
        {
          id: 3,
          created: '2021-01-15T19:03:45',
          updated: '2021-01-15T19:03:48',
          statu: 1,
          parentId: 1,
          name: '角色管理',
          path: '/system/roles',
          perms: 'sys:role:list',
          component: 'system/Role',
          type: 1,
          icon: 'el-icon-rank',
          ordernum: 2,
          children: [],
        },
      ],
    },
    {
      id: 5,
      created: '2021-01-15T19:06:11',
      updated: null,
      statu: 1,
      parentId: 0,
      name: '系统工具',
      path: '',
      perms: 'sys:tools',
      component: null,
      type: 0,
      icon: 'el-icon-s-tools',
      ordernum: 2,

      children: [
        {
          id: 6,
          created: '2021-01-15T19:07:18',
          updated: '2021-01-18T16:32:13',
          statu: 1,
          parentId: 5,
          name: '数据管理',
          path: '/system/data',
          perms: 'sys:dict:data',
          component: 'system/Data',
          type: 1,
          icon: 'el-icon-s-order',
          ordernum: 1,
          children: [],
        },
      ],
    },
  ]
  Result.data = menus
  return Result
})

//模拟：响应删除菜单的操作，传递参数菜单编号id
//* 表示执行操作是：delete（删除）  save（保存）  update（更新）
Mock.mock(RegExp('/system/menu/*'), 'post', () => {
  //代表模拟删除、插入、更新操作都是成功的。
  return Result
})

//根据菜单的编号获得菜单对象信息
////管理菜单，根据菜单 Id查询该菜单详细信息/////////////////
Mock.mock(RegExp('/system/menu/info/*'), 'get', () => {
  Result.data = {
    id: 3,
    statu: 1,
    parentId: 1,
    name: '角色管理',
    path: '/system/roles',
    perms: 'sys:role:list',
    component: 'system/Role',
    type: 1,
    icon: 'el-icon-rank',
    orderNum: 2,
    children: [],
  }
  return Result
})

//获得所有的角色信息
///请求获得服务器 角色列表 信息///    正则表达式
// * 代表就所搜时候 模糊查询传递的参数
Mock.mock(RegExp('/system/role/list*'), 'get', () => {
  Result.data = {
    //records封装分页的数据
    records: [
      {
        id: 3,
        created: '2021-01-04T10:09:14',
        updated: '2021-01-30T08:19:52',
        statu: 1,
        name: '普通用户',
        code: 'normal',
        remark: '只有基本查看功能',
        menuIds: [],
      },
      {
        id: 6,
        created: '2021-01-16T13:29:03',
        updated: '2021-01-17T15:50:45',
        statu: 0,
        name: '超级管理员',
        code: 'admin',
        remark: '系统默认最高权限，不可以编辑和任意修改 ',
        menuIds: [],
      },
    ],
    total: 2, //当前总记录数
    size: 10, //一页显示多少数据
    current: 1, //当前页码
    orders: [],
    optimizeCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: 1, //一共有多少页
  }

  return Result
})

//////通过角色id获得角色信息///////   RestFul
//* 参数就是传递角色编号 /system/role/info/6
Mock.mock(RegExp('/system/role/info/*'), 'get', () => {
  Result.data = {
    id: 6,
    created: '2021-01-16T13:29:03',
    updated: '2021-01-17T15:50:45',
    statu: 1,
    name: '超级管理员',
    code: 'admin',
    remark: '系统默认最高权限，不可以编辑和任意修改',
    menuIds: [9, 10, 11, 12, 13], //菜单id数组，就是该角色权限信息
  }

  return Result
})

///////////保存或更新 、删除 角色方法////////////
//* 代表传递参数，update是更新角色，save要保存新角色   delete删除角色
Mock.mock(RegExp('/system/role/*'), 'post', () => {
  return Result
})

///获得所有用户的信息////
//////////////// 用户管理 ////////////////
Mock.mock(RegExp('/system/user/list*'), 'get', () => {
  Result.data = {
    records: [
      {
        id: 1,
        created: '2021-01-12T22:13:53',
        updated: '2021-01-16T16:57:32',
        statu: 1,
        username: 'admin',
        password:
          '$2a$10$oPaOFhl1IYrUgHj3kcpW7OJYR9N9wGudceRdNVIs8aSY4Q7rLCGuK', //123123
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=3733d94221afc7ea3189dc0ffa30fd47',
        email: '999@qq.com',
        tel: '15343517807',
        lastLogin: '2020-12-30T08:38:37',
        roles: [
          {
            id: 6,
            created: '2021-01-16T13:29:03',
            updated: '2021-01-17T15:50:45',
            statu: 1,
            name: '超级管理员',
            code: 'admin',
            remark: '系统默认最高权限，不可以编辑和任意修改',
            menuIds: [],
          },
          {
            id: 3,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-30T08:19:52',
            statu: 1,
            name: '普通用户',
            code: 'normal',
            remark: '只有基本查看功能',
            menuIds: [],
          },
        ],
      },
      {
        id: 2,
        created: '2021-01-30T08:20:22',
        updated: '2021-01-30T08:55:57',
        statu: 1,
        username: 'test',
        password:
          '$2a$10$oPaOFhl1IYrUgHj3kcpW7OJYR9N9wGudceRdNVIs8aSY4Q7rLCGuK',
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201908%2F19%2F20190819150344_ALnaX.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=a23b8c8c9f154ea09f54728b6e04e7f9',
        email: 'test@qq.com',
        tel: 133667788899,
        lastLogin: null,
        roles: [
          {
            id: 3,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-30T08:19:52',
            statu: 1,
            name: '普通用户',
            code: 'normal',
            remark: '只有基本查看功能',
            menuIds: [],
          },
        ],
      },
    ],
    total: 2,
    size: 10,
    current: 1,
    orders: [],
    optimizeCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: 1,
  }
  return Result
})

/////////////////////根据用户编号id 获得用户信息/////////////////////////
Mock.mock(RegExp('/system/user/info/*'), 'get', () => {
  Result.data = {
    id: 2,
    created: '2022-01-30T08:20:22',
    updated: '2022-01-30T08:55:57',
    statu: 1,
    username: 'test',
    password: '$2a$10$oPaOFhl1IYrUgHj3kcpW7OJYR9N9wGudceRdNVIs8aSY4Q7rLCGuK',
    avatar:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201908%2F19%2F20190819150344_ALnaX.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=a23b8c8c9f154ea09f54728b6e04e7f9',
    email: '999@qq.com',
    tel: '15343517807',
    lastLogin: null,
    roles: [
      //该用户目前所拥有的角色对象
      {
        id: 6,
        created: '2021-01-16T13:29:03',
        updated: '2021-01-17T15:50:45',
        statu: 1,
        name: '超级管理员',
        code: 'admin',
        remark: '系统默认最高权限，不可以编辑和任意修改',
        menuIds: [],
      },
      {
        id: 3,
        created: '2021-01-04T10:09:14',
        updated: '2021-01-30T08:19:52',
        statu: 1,
        name: '普通用户',
        code: 'normal',
        remark: '只有基本查看功能',
        menuIds: [],
      },
    ],
  }
  return Result
})


//更新密码 /system/user/repass.
// 删除用户 /system/user/delete
// 新增用户 /system/user/save
// 更新用户 /system/user/update
Mock.mock(RegExp('/system/user/*'), 'post', () => {
  return Result
})


// 获取所有客户的信息cus
Mock.mock(RegExp('/system/cus/list*'), 'get', () => {
  Result.data = [
    {
      id: 1,
      avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=3733d94221afc7ea3189dc0ffa30fd47',
      username: '小天',
      nickname: '小天',
      email: "123@qq.com",
      birthday: "2021-01-12T22:13:53",
      gender: 1,
      info: "个人简介",
      created: "2021-01-12T22:13:53",
      statu: 1,
    },
  ]
  return Result
})


// 获取一个客户的信息cus
Mock.mock(RegExp('/system/cus/info*'), 'get', () => {
  Result.data = {
    id: 1,
    avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=3733d94221afc7ea3189dc0ffa30fd47',
    username: '小天',
    nickname: '小天',
    email: "123@qq.com",
    birthday: "2021-01-12T22:13:53",
    gender: 1,
    info: "个人简介",
    created: "2021-01-12T22:13:53",
    statu: 1,
  }
  return Result
})


// 获取所有订单信息
Mock.mock(RegExp('/system/order/list*'), 'get', () => {
  Result.data = [
    {
      id: 1,
      uid: 1,
      phone: 1234567,
      aid: 1,
      seates: 23,
      price: 33,
      paid: "2021-01-12T22:13:53",
      statu: 2
    },
    {
      id: 2,
      uid: 2,
      phone: 1234567,
      aid: 2,
      seates: 42,
      price: 55,
      paid: "2021-01-12T22:13:53",
      statu: 1
    }
  ]

  return Result
})

// 获取一个订单信息
Mock.mock(RegExp('/system/order/info*'), 'get', () => {
  Result.data =
  {
    id: 1,
    uid: 1,
    phone: 1234567,
    aid: 1,
    seates: 23,
    price: 33,
    paid: "2021-01-12",
    statu: 2
  }

  return Result
})

// 删除 /system/order/delete
// 新增 /system/order/save
// 更新 /system/order/update
Mock.mock(RegExp('/system/order/*'), 'post', () => {
  return Result
})


// 获取所有购物车信息
Mock.mock(RegExp('/system/cart/list*'), 'get', () => {
  Result.data = [
    {
      id: 1,
      uid: 1,
      phone: 1234567,
      aid: 1,
      seates: 23,
      price: 33,
      statu: 2
    },
    {
      id: 2,
      uid: 2,
      phone: 1234567,
      aid: 2,
      seates: 42,
      price: 55,
      statu: 1
    }
  ]

  return Result
})

// 获取所有购物车信息
Mock.mock(RegExp('/system/cart/info*'), 'get', () => {
  Result.data =
    {
      id: 1,
      uid: 1,
      phone: 1234567,
      aid: 1,
      seates: 23,
      price: 33,
      statu: 2
    }

  return Result
})

// 删除 /system/cart/delete
// 新增 /system/cart/save
// 更新 /system/cart/update
Mock.mock(RegExp('/system/cart/*'), 'post', () => {
  return Result
})


// 获取所有电影信息
Mock.mock(RegExp('/system/film/list*'), 'get', () => {
  Result.data = [
    {
      id: 1,
      name: "疯狂的石头",
      releaseTime: "2022-01-01",
      type: "喜剧片",
      region: "中国",
      hot: 33,
      introduction:"电影介绍",
      cover:"https://star.xiziwang.net/uploads/allimg/140614/34-1406140Z3220-L.jpg",
      duration:120,
      statu: 2
    },
  ]
  return Result
})

// 获取一个电影信息
Mock.mock(RegExp('/system/film/info*'), 'get', () => {
  Result.data = 
    {
      id: 1,
      name: "疯狂的石头",
      releaseTime: "2022-01-01",
      type: "喜剧片",
      region: "中国",
      hot: 33,
      introduction:"电影介绍",
      cover:"https://star.xiziwang.net/uploads/allimg/140614/34-1406140Z3220-L.jpg",
      duration:120,
      statu: 2
    }
  
  return Result
})

// 删除 /system/film/delete
// 新增 /system/film/save
// 更新 /system/film/update
Mock.mock(RegExp('/system/film/*'), 'post', () => {
  return Result
})


// 获取所有电影评论信息
Mock.mock(RegExp('/system/filmevaluate/list*'), 'get', () => {
  Result.data = [
    {
      id: 1,
      fid: 1,
      uid: 1,
      star: 5,
      comment: "这电影真好看",
      statu: 2,
      created: "2022-12-01"
    },
    {
      id: 2,
      fid: 2,
      uid: 2,
      star: 2,
      comment: "这电影没意思",
      statu: 1,
      created: "2022-12-01"
    },
  ]
  return Result
})

// 获取一个电影评论信息
Mock.mock(RegExp('/system/filmevaluate/info*'), 'get', () => {
  Result.data = 
  {
    id: 1,
    fid: 1,
    uid: 1,
    star: 5,
    comment: "这电影真好看",
    statu: 2,
    created: "2022-12-01"
  }
  
  return Result
})

// 删除 /system/filmevaluate/delete
// 新增 /system/filmevaluate/save
// 更新 /system/filmevaluate/update
Mock.mock(RegExp('/system/filmevaluate/*'), 'post', () => {
  return Result
})



// 获取所有排片信息
Mock.mock(RegExp('/system/arrangement/list*'), 'get', () => {
  Result.data = [
    {
      id: 1,
      fid: 1,
      name: "疯狂的石头",
      seatNumber: 80,
      boxOffice: 1600,
      price: 20,
      type: "2D",
      data: "2022-03-10",
      startTime:"22:13:53",
      endTime:"22:13:53",
      founder: "zbw",
      statu: "1",
      created: "2022-03-10T22:13:53"
    },
    {
      id: 2,
      fid: 2,
      name: "疯狂的自行车",
      seatNumber: 80,
      boxOffice: 1600,
      price: 20,
      type: "2D",
      data: "2022-03-10",
      startTime:"22:13:53",
      endTime:"22:13:53",
      founder: "zbw",
      statu: "2",
      created: "2022-03-10T22:13:53"
    },
  ]
  return Result
})


// 获取一个排片信息
Mock.mock(RegExp('/system/arrangement/info*'), 'get', () => {
  Result.data = 
  {
    id: 1,
    fid: 1,
    name: "疯狂的石头",
    seatNumber: 80,
    boxOffice: 1600,
    price: 20,
    type: "2D",
    data: "2022-03-10",
    startTime:"22:13:53",
    endTime:"22:13:53",
    founder: "zbw",
    statu: 1,
    created: "2022-03-10T22:13:53"
  }
  
  return Result
})

// 删除 /system/arrangement/delete
// 新增 /system/arrangement/save
// 更新 /system/arrangement/update
Mock.mock(RegExp('/system/arrangement/*'), 'post', () => {
  return Result
})



// 获取所有轮播图的信息
Mock.mock(RegExp('/system/poster/list*'), 'get', () => {
  Result.data = [
    {
      id: 1,
      title: "疯狂的石头",
      url: "https://star.xiziwang.net/uploads/allimg/140614/34-1406140Z3220-L.jpg",
      statu: 1,
      created: "2022-03-10T22:13:53",
      updated: "2022-03-10T22:13:53"
    },
    {
      id: 2,
      title: "疯狂的石头",
      url: "https://star.xiziwang.net/uploads/allimg/140614/34-1406140Z3220-L.jpg",
      statu: 2,
      created: "2022-03-10T22:13:53",
      updated: "2022-03-10T22:13:53"
    },
  ]
  return Result
})

// 获取一个轮播图的信息
Mock.mock(RegExp('/system/poster/info*'), 'get', () => {
  Result.data = 
    {
      id: 1,
      title: "疯狂的石头",
      url: "https://star.xiziwang.net/uploads/allimg/140614/34-1406140Z3220-L.jpg",
      statu: 1,
      created: "2022-03-10T22:13:53",
      updated: "2022-03-10T22:13:53"
    }
  return Result
})


// 删除 /system/arrangement/delete
// 新增 /system/arrangement/save
// 更新 /system/arrangement/update
Mock.mock(RegExp('/system/poster/*'), 'post', () => {
  return Result
})



