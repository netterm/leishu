import request from '@/utils/request'

const userApi = {
  base: '/center-wechat/k/q/bms/real/name/register',
	register: ''
}

export function registerRealname(data: object) {
  return request({
    url: userApi.base,
    method: 'post',
    data
  })
}

export function registerFaceCompare(data: FormData) {
  return request({
    url: userApi.base + '/face/compare',
    method: 'post',
    data
  })
}

export function uploadFront(data: FormData) {
  return request({
    url: userApi.base + '/ocr/face',
    method: 'post',
    data
  })
}

export function uploadBack(data: FormData) {
  return request({
    url: userApi.base + '/ocr/back',
    method: 'post',
    data
  })
}

export function uploadCompress(data: FormData) {
  return request({
    url: userApi.base + '/compress/photo',
    method: 'post',
    data
  })
}
