import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'

/**
 * 在vue实例加载完后循环调用传入方法
 * @param fn  循环调用的方法
 * @param delay 循环间隔时间
 * @param before  是否在循环前调用一次传入方法
 */
export function setIntervalHook(
  fn: () => unknown,
  delay: number,
  before = true
) {
  let timer = 0
  if (before) fn()
  function doIt() {
    window.clearInterval(timer)
    timer = window.setInterval(fn, delay)
  }
  onMounted(doIt)
  onActivated(doIt)
  onDeactivated(() => clearInterval(timer))
  onUnmounted(() => clearInterval(timer))
}
