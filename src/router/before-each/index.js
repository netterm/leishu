import { setTitle } from './title'
import { hasAccount } from './auth'
import { hasIdCard } from './has-id-card'
// import { hasProject } from './project'

export default (to, from, next) => {
  setTitle(to) // 设置跳转页标题
    .then(() => hasAccount(to)) // 登录权限校验
    .then(() => hasIdCard(to)) // 是否实名校验
    .then(() => next()) // 全部校验通过,允许跳转
    .catch(route => {
      // 有校验未通过,跳转到该校验报错指定路由
      next(route)
    })
}
