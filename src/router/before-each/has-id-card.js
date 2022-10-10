import { useAuthStore } from '@/store/index'
export function hasIdCard(to) {
  const auth = useAuthStore()
  if (auth.account.idCard) return Promise.resolve() // 存在身份证号码放行
  if (to.name === 'login') return Promise.reject() // 无身份证号并将要跳转到实名认证页则直接放行,不进行后续验证
  // 无身份证号跳转到实名制认证页面
  return Promise.reject({
    name: 'login',
    query: { link: to.fullPath }
  })
}
