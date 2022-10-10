import { createRouter, createWebHistory } from 'vue-router'
import staticRoutes from './static-routes' // 静态路由
import beforeEachListener from './before-each' // 路由beforeEach守卫的监听器

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes
})

router.beforeEach(beforeEachListener)

export const START_LOCATION = location.href // 记录进入页面时的地址,ios会用到

export default router
