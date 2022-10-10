import { useAuthStore } from '@/store/index'
import { Dialog } from 'vant'

export function hasAccount(to) {
  const auth = useAuthStore()

  // 无权限导航直接放行
  if (to.name === 'not-auth' || to?.meta?.token === false)
    return Promise.reject()

  const userId = to?.query?.userId // 路径中传入的用户id

  const account = auth.account // 存储的账号信息

  // 传入用户id若与本地存储用户id不一致则先清除本地存储信息
  if (userId && userId !== account.id) auth.Clear()

  if (userId) {
    return auth
      .GetAccount(userId)
      .catch(err => {
        console.error(err)
        Dialog.alert({
          title: '获取用户信息失败'
        })
        return Promise.reject({ name: 'not-auth' })
      })
      .then(() => {
        const route = {
          name: to.name,
          path: to.path,
          query: to.query || {},
          params: to.params
        }
        delete route.query.userId
        throw route
      })
  }

  // 若本地存储了用户信息则读取该信息
  if (account.id) return Promise.resolve()

  // 无用户信息且未传入userId时跳入错误反馈页面
  return Promise.reject({ name: 'not-auth' })
}
