import { useAuthStore } from '@/store/index'
import request from '@/utils/request'
import { getNodeDomain } from './home'
const auth = useAuthStore()

const domain = ''

const api = {
  base(isHBase?: boolean) {
    if (!isHBase) return '/center/file/k/q/open'
    return '/center/file/k/q/hbase/open'
  }
}

export function getFileById(id: string, isHBase: boolean) {
  return request({
    url: api.base(isHBase) + '/' + id
  })
}
/**
 *
 * @param module 文件模块名(自定义)
 * @param files 文件formData
 * @param HBase 是否上传到大数据
 * @param splitServers 是否为分服务
 * @returns
 */
export function uploadFiles(
  module: string,
  files: FormData,
  HBase: boolean,
  splitServers: boolean
) {
  return Promise.resolve()
    .then((): object => {
      // 如果不是分服务则不添加请求地址前缀
      if (!splitServers) return { code: 0, data: '' }
      // // 如果为分服务且已获取到服务器名称则直接返回该名称
      if (domain) return { code: 0, data: domain }
      // 如果为分服务且未获取到服务器名称则请求获取服务器名称
      return getNodeDomain({ projectId: auth.project.id })
    })
    .then(res => {
      const { code, data, message } = res as HTTPResponseInterface<string>
      if (code !== 0) throw Error(message)
      return request({
        url: data + api.base(HBase) + '/files/' + module,
        method: 'post',
        data: files
      })
    })
}

export function uploadBase64(
  module: string,
  base64s: string[],
  HBase: boolean
) {
  return request({
    url: api.base(HBase) + '/base64/' + module,
    method: 'post',
    headers: { contentType: 'application/json;charset=UTF-8' },
    data: base64s
  })
}
