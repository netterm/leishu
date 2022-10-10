/**
 * 获取微信公众号api环境
 */
import {
  ready as wReady,
  error as wError,
  config as wConfig
} from '@tybys/jweixin'
import sha1 from './sha1'
import { START_LOCATION } from '@/router/index'
import getDevice from './getDevice'
import { getTicket } from '@/api/login'
const { isIOS } = getDevice()

/**
 * 初始化公众号sdk环境
 * @param {公众号配置} wxConfig
 * @returns {AxiosPromise}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function (wxConfig: any) {
  return getTicket()
    .then(
      ({
        code,
        data,
        message
      }: HTTPResponseInterface<{ ticket: string; appId: string }>) => {
        if (code !== 0) throw Error(message)

        const timestamp = Date.now() + '' // 时间戳

        const nonceStr = parseInt((Math.random() * 100000000).toString()) // 随机字符串

        const url = isIOS ? START_LOCATION : location.href

        const string1 = `jsapi_ticket=${data.ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`

        const signature = sha1(string1)

        wConfig(
          Object.assign(
            {
              appId: data.appId, // 必填，公众号的唯一标识
              nonceStr,
              timestamp,
              signature
            },
            wxConfig // 其余配置
          )
        )
      }
    )
    .then(
      () =>
        new Promise((resolve, reject) => {
          wReady(() => resolve(0)) // 初始化完成
          wError(reject) // 初始化失败
        })
    )
}
