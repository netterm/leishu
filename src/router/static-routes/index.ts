import { RouteRecordRaw } from 'vue-router'

/* 路由对象
 * {
 *   name: 路由名称,
 *   path: 路由路径,
 *   meta: {
 *     title: 页面标题,
 *     keepAlive: 切换到其他页面后是否保存当前路由状态 默认true,
 *     token: 当前页面是否需要登录验证 默认true,
 *   }
 * }
 */
const routes: RouteRecordRaw[] = [
  {
    name: 'root',
    path: '/',
    redirect: '/dailyfill'
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '注册中心',
      keepAlive: false
    },
    props: ({ query }: { query: Record<string, string> }) => ({
      redirect: query.redirect,
      userId: query.userId
    }),
    component: () => import('@/views/login/index.vue')
  },
  {
    name: 'home',
    path: '/home',
    meta: {
      title: '工人端智慧工地',
      keepAlive: false
    },
    component: () => import('@/views/home/index.vue')
  },
  {
    name: 'qrcode',
    path: '/qrcode',
    meta: {
      title: '二维码',
      keepAlive: false
    },
    component: () => import('@/views/home/qrcode/index.vue')
  },
  {
    name: 'project',
    path: '/project',
    meta: { title: '工程' },
    component: () => import('@/views/project/index.vue'),
    redirect: () => ({ name: 'project-switch' }),
    children: [
      {
        name: 'project-switch',
        path: 'switch',
        meta: { title: '工程切换' },
        component: () => import('@/views/project/switch/index.vue'),
        props: ({ query }) => ({
          link: query.link
        })
      }
    ]
  },
  {
    name: 'authentication',
    path: '/authentication',
    meta: { title: '实名认证' },
    component: () => import('@/views/authentication/index.vue'),
    props: ({ query }) => ({
      link: query.link
    })
  },
  {
    name: 'attendance-sign',
    path: '/attendancesign',
    meta: { title: '考勤打卡' },
    component: () => import('@/views/attendance-sign/index.vue')
  },
  {
    name: 'attendance-rule',
    path: '/attendancerule',
    meta: { title: '考勤规则' },
    component: () => import('@/views/attendance-sign/rule.vue')
  },

  // 每日填报

  {
    name: 'dailyFill',
    path: '/dailyfill',
    meta: { title: '销售线索' },
    component: () => import('@/views/dailyFill/index.vue')
    // children: [
    //   {
    //     name: 'createDailyFill',
    //     path: 'createdailyfill',
    //     meta: { title: '新建每日填报' },
    //     component: () => import('@/views/dailyFill/create/index.vue'),
    //     props: ({ params }) => params
    //   }
    // ]
  },
  {
    name: 'createDailyFill',
    path: '/createdailyfill',
    meta: { title: '新建销售线索' },
    component: () => import('@/views/dailyFill/create/index.vue'),
    props: ({ params }) => params
  },
  {
    name: 'updataDailyfill',
    path: '/updatadailyfill/:id',
    meta: { title: '修改销售线索' },
    component: () => import('@/views/dailyFill/updata/index.vue'),
    props: ({ params }) => params
  },
  {
    name: 'queryError',
    path: '/queryError',
    meta: { title: '设备故障查询', token: false },
    component: () => import('@/views/queryError/index.vue'),
    props: ({ params }) => params
  }
]

const errorsRoutes = [
  {
    name: 'not-auth',
    path: '/304',
    meta: { token: false },
    component: () => import('@/views/304/index.vue')
  },
  {
    name: 'not-found',
    path: '/404',
    meta: { token: false },
    component: () => import('@/views/404/index.vue')
  },
  {
    path: '/*',
    meta: { token: false },
    redirect: '/404'
  }
]

export default routes.concat(errorsRoutes)
