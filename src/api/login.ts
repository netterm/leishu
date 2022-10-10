import request from '@/utils/request'

const userApi = {
  base: '/center-wechat/k/q/wx/bms/auth/login'
}

export function getTicket() {
  return request({
    url: '/center-wechat/k/q/bms/login/ticket',
    method: 'get'
  })
}

export function getOpenId(params: object) {
  return request({
    url: userApi.base + '/openid',
    method: 'get',
    params
  })
}

export function loginState(state: string) {
  return request({
    url: userApi.base + '/' + state,
    method: 'get'
  })
}
