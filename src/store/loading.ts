import { defineStore } from 'pinia'

type ConfigType = {
  visible: boolean
  type: 'circular' | 'spinner'
  color: string
  message: string | null
}

export default defineStore('loading', {
  state: (): ConfigType => ({
    visible: false,
    type: 'circular',
    color: '#ffffff',
    message: null
  }),
  actions: {
    loadStart(config: ConfigType) {
      this.visible = true
      this.type = config.type || 'circular'
      this.color = config.color || '#ffffff'
      this.message = config.message || null
    },
    loadStop() {
      this.visible = false
      this.type = 'circular'
      this.color = '#ffffff'
      this.message = null
    }
  }
})
