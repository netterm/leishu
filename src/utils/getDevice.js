/**
 * @returns {浏览器信息}
 */
export default function getDevice() {
  const { clientHeight, clientWidth } = document.documentElement

  // 浏览器信息
  const ua = navigator.userAgent.toLowerCase()

  // 浏览器类型
  let type = (ua.match(/firefox|chrome|safari|opera/g) || 'other')[0]

  if ((ua.match(/msie|trident/g) || [])[0]) {
    type = 'msie'
  }

  // 平台标签
  let tag = ''

  const isTocuh =
    'ontouchstart' in window ||
    ua.indexOf('touch') !== -1 ||
    ua.indexOf('mobile') !== -1
  if (isTocuh) {
    if (ua.indexOf('ipad') !== -1) {
      tag = 'pad'
    } else if (ua.indexOf('mobile') !== -1) {
      tag = 'mobile'
    } else if (ua.indexOf('android') !== -1) {
      tag = 'androidPad'
    } else {
      tag = 'pc'
    }
  } else {
    tag = 'pc'
  }

  // 浏览器内核
  let prefix = ''

  switch (type) {
    case 'chrome':
    case 'safari':
    case 'mobile':
      prefix = 'webkit'
      break
    case 'msie':
      prefix = 'ms'
      break
    case 'firefox':
      prefix = 'Moz'
      break
    case 'opera':
      prefix = 'O'
      break
    default:
      prefix = 'webkit'
      break
  }

  // 操作平台
  const plat =
    ua.indexOf('android') > 0 ? 'android' : navigator.platform.toLowerCase()

  // 屏幕信息
  let screen = 'full'

  if (clientWidth < 768) {
    screen = 'xs'
  } else if (clientWidth < 992) {
    screen = 'sm'
  } else if (clientWidth < 1200) {
    screen = 'md'
  } else if (clientWidth < 1920) {
    screen = 'xl'
  } else {
    screen = 'full'
  }

  // 是否为现代浏览器
  const isModern = (() => {
    try {
      new Function('_=>_')
      return true
    } catch (err) {
      return false
    }
  })()

  // 是否 ios
  const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

  // 浏览器版本
  const version = (ua.match(/[\s\S]+(?:rv|it|ra|ie)[/: ]([\d.]+)/) || [])[1]

  // 是否 PC 端
  const isPC = tag === 'pc'

  // 是否移动端
  const isMobile = isPC ? false : true

  // 是否移动端 + 屏幕宽过小
  const isMini = screen === 'xs' || isMobile

  // 是否位微信端
  const isWechat =
    window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
    'micromessenger'

  return {
    height: clientHeight, // 文档对象高度
    width: clientWidth, // 文档对象宽度
    version, // 浏览器版本
    type, // 浏览器类型 [firefox,chrome,safari,opera,msie,trident]
    plat, // 操作系统类型 android或其他
    tag, // 浏览器运行设备类型 [pad,mobile,androidPad,pc]
    prefix, // 浏览器内核 [webkit,ms,Moz,O,webkit]
    isMobile, // 浏览器运行设备为移动端
    isIOS, // 浏览器运行设备为IOS端
    isPC, // 浏览器运行设备为PC端
    isMini, // 屏幕宽度为xs
    isWechat, // 是否为微信浏览器环境
    screen, // 屏幕宽度尺寸区间 [xs,sm,md,xl,full]
    isModern // 是否为现代浏览器
  }
}
