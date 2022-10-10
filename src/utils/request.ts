import { useAuthStore } from '@/store/index'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { Notify } from 'vant'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: '/',
  timeout: 0 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error: AxiosError) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      Notify({
        type: 'danger',
        message: data.message
      })
    }
    if (
      error.response.status === 401 &&
      !(data.result && data.result.isLogin)
    ) {
      Notify({
        type: 'danger',
        message: 'Unauthorized'
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const account = useAuthStore().account
  const headers: { [key: string]: string } = {}
  headers['Cache-Control'] = 'private,no-cache'
  if (account) {
    headers.userId = account.id
    headers.idCard = account.idCard
    headers.openId = account.openId
  }
  config.headers = headers
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  const result = response.data as HTTPResponseInterface<never>
  return result
}, errorHandler)

interface RequestInstance extends AxiosInstance {
  (config: AxiosRequestConfig): Promise<never>
  (url: string, config?: AxiosRequestConfig): Promise<never>
}

export default request as RequestInstance
