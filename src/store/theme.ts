import { defineStore } from 'pinia'

export default defineStore('theme', {
  /**
   * 该处加vant-ui的css变量
   * 详情见：
   * @url https://vant-contrib.gitee.io/vant/#/zh-CN/config-provider
   * @warning 注意：不要加局部页面的样式
   */
  state: () => ({
    // 配色
    white: '#ffffff', // 白色
    blue: '#1989fa', // primary 主题
    green: '#07c160', // success 成功
    red: '#ee0a24', // danger 危险
    orange: '#ff976a', // waning 告警
    gray8: '#323233', // text-color 主文本色
    gray6: '#969799', // text-color-2 二级文本色
    gray5: '#c8c9cc', // text-color-3 三级文本色
    gray3: '#ebedf0', // 明灰色
    gray2: '#f2f3f5', // active-color 活动状态
    gray1: '#f7f8fa', // background-color 灰度背景色
    textLinkColor: '#576b95', // text-link-color 文本链接

    cellVerticalPadding: '0.3rem' // 列垂直内边距
  })
})
