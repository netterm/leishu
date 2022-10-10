import request from '@/utils/request'

const userApi = {
  base: '/center-wechat/k/q/index'
}

export function getPersonal() {
  return request({
    url: userApi.base + '/personal',
    method: 'get'
  })
}

export function getGroup(params: Record<'projectId', string>) {
  return request({
    url: userApi.base + '/group',
    method: 'get',
    params
  })
}

export function getNodeDomain(params: object) {
  return request({
    url: userApi.base + '/node/domain',
    method: 'get',
    params
  })
}

export function getAttendanceList(params: object) {
  return request({
    url: userApi.base + '/attendance',
    method: 'get',
    params
  })
}

export function getAttendanceDetails(params: object) {
  return request({
    url: userApi.base + '/attendance/detail',
    method: 'get',
    params
  })
}

export function getSalaryList(params: object) {
  return request({
    url: userApi.base + '/salary',
    method: 'get',
    params
  })
}

export function getContractList(query: object) {
  return request({
    url: userApi.base + '/contract',
    method: 'get',
    params: query
  })
}

export function getExperience(query: object) {
  return request({
    url: userApi.base + '/jobRecord',
    method: 'get',
    params: query
  })
}

export function getExperienceDetail(
  params: Record<'id' | 'projectId' | 'status', string>
) {
  return request({
    url: userApi.base + '/jobRecord/detail',
    method: 'get',
    params
  })
}

export function getTrainingList(query: object) {
  return request({
    url: userApi.base + '/training',
    method: 'get',
    params: query
  })
}

export function getTraining(
  params: Record<'projectId' | 'trainingId', string>
) {
  return request({
    url: userApi.base + '/training/detail',
    method: 'get',
    params
  })
}

export function getObjection(query: object) {
  return request({
    url: userApi.base + '/objection',
    method: 'get',
    params: query
  })
}
