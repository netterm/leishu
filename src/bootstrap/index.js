import dayjs from 'dayjs'
import request from '@/utils/request'

export default app => {
  // vue原型链全局变量追加工具库
  app.use(addLibs)
}

function addLibs(app) {
  const libs = {
    // http请求方法
    $http: request,

    // 日期操作工具
    $moment: dayjs
  }

  // 原型链全局函数
  Object.keys(libs).forEach(field => {
    app.config.globalProperties[field] = libs[field]
  })
}
