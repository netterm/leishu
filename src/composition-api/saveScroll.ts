import debounce from 'lodash.debounce'
import { onActivated, onDeactivated, Ref } from 'vue'

/**
 * 存储节点的滚动条状态
 * @param elm // 滚动节点的双向绑定数据模型
 */
export function saveScrollHook(elm: Ref<Element | undefined>) {
  // 滚动状态
  const scroll = {
    top: 0,
    left: 0,
    behavior: 'auto'
  } as ScrollToOptions

  /**
   * 监听滚动条,并记录滚动状态
   * @param e 滚动事件
   */
  const onScroll = debounce(function (e: Event) {
    const target = e.target as Element
    scroll.top = target.scrollTop
    scroll.left = target.scrollLeft
  }, 100)

  // keep-alive状态下组件dom插入后
  onActivated(() => {
    elm.value?.scrollTo(scroll)
    elm.value?.addEventListener('scroll', onScroll) // 开始监听
  })

  // keep-alive状态下组件dom移除后
  onDeactivated(() => {
    elm.value?.removeEventListener('scroll', onScroll) // 移除已有监听事件
  })
}
