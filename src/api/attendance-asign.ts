import request from '@/utils/request'

const userApi = {
  base: '/center-wechat/k/q/attendance/fence'
}

export function getAttendanceFence(params: object) {
  return request({
    url: userApi.base,
    method: 'get',
    params
  })
}

export function getAttendance(params: object) {
  return request({
    url: userApi.base + '/att',
    method: 'get',
    params
  })
}

export function createAttendance(params: object, data: FormData) {
  return request({
    url: userApi.base,
    method: 'post',
    params,
    data
  })
}
