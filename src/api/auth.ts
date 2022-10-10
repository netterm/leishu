import request from '@/utils/request'

const userApi = {
  base: '/center-wechat/k/q/fast/auth'
}

export function fastAuth(data: object) {
  return request({
    url: userApi.base + '/bms',
    method: 'post',
    data: data
  })
}

export function sendCode(params: object) {
  return request({
    url: userApi.base + '/sms',
    method: 'post',
    params
  })
}
