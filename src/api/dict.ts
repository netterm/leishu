import request from '@/utils/request'

const userApi = {
  base: '/center-business/k/q/dict'
}

export function getDictByCategory(category: string) {
  return request({
    url: userApi.base + '/by/category',
    method: 'get',
    params: { category }
  })
}
