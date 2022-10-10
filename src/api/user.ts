import request from '@/utils/request'

const userApi = {
  base: '/center-wechat/k/q/user'
}
export function getAccountById(id: string) {
  return request({
    url: userApi.base + '/bms/' + id,
    method: 'get'
  })
}

export function getAuthAccountById(id: string) {
  return request({
    url: userApi.base + '/account/' + id,
    method: 'get'
  })
}
