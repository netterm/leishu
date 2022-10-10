import request from '@/utils/request'

const userApi = {
  base: '/center-wechat/k/q/salary'
}

export function salarySure(query: object) {
  return request({
    url: userApi.base + '/confirm',
    method: 'post',
    params: query
  })
}

export function salaryReject(query: object, data: object) {
  return request({
    url: userApi.base + '/objection',
    method: 'post',
    params: query,
    data
  })
}
