import { useAuthStore } from '@/store/index'
import { onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 监听项目切换
 * @param callback 回调函数
 * @return {void}
 */
export function onSwitchProjectHook(
  callback: (project: ProjectInterface) => unknown
) {
  const auth = useAuthStore() // 权限状态
  const router = useRouter() // 路由器状态
  const route = router.currentRoute.value // 存储调用该hook函数的路由地址
  let isChanged = false // 在访问外部路由时项目是否被切换过

  watch(
    () => auth.project.id,
    () => {
      const currentRoute = router.currentRoute.value // 获取当前访问路由

      // 当前访问路由非调用该hook函数的路由,声明项目已被切换,不执行回调函数
      if (currentRoute.path !== route.path) {
        isChanged = true
        return
      }

      callback(auth.project) // 执行回调函数
      isChanged = false // 已经执行了回调函数,所以声明项目未切换
    }
  )

  // 当该路由为缓存路由时若项目被切换过,再次访问该路由则调用一次回调函数
  onActivated(() => {
    if (isChanged) {
      callback(auth.project) // 执行回调函数
      isChanged = false // 已经执行了回调函数,所以声明项目未切换
    }
  })
}
