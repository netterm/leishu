import request from '@/utils/request'

const userApi = {
  base: '/center-wechat/k/q/index'
}

export function pullProjectList() {
  return request({
    url: userApi.base + '/no/project',
    method: 'get'
  })
}

export function getProjectList() {
  return request({
    url: userApi.base + '/project/list',
    method: 'get'
  })
}
