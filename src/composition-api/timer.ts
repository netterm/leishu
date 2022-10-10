import { onActivated, onMounted, ref } from 'vue'

export function getTimerHook() {
  const timer = ref(new Date())

  let interval = 0

  function setTimer() {
    clearInterval(interval)
    interval = 0
    interval = setInterval(() => {
      timer.value = new Date()
    })
    timer.value = new Date()
  }

  onMounted(setTimer)
  onActivated(setTimer)

  return timer
}
