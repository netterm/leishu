import 'virtual:windi.css' // windiCSS
import 'vant/es/toast/style' // vant吐司组件样式
import 'vant/es/dialog/style' // vant弹窗组件样式
import 'vant/es/notify/style' // vant通知组件样式
import 'vant/es/image-preview/style' // vant图片预览组件样式
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index'
import bootstrap from './bootstrap'
import components from './components'

// root样式变量
import '@style/root.scss'

// 全局样式
import '@style/global.scss'

// 创建vue应用程序
const app = createApp(App)

app
  .use(createPinia()) // 状态管理
  .use(bootstrap) // 初始化应用程序
  .use(components) // 组件懒加载
  .use(router) // 路由
  .mount('#app') // 渲染节点

// app实例绑定到window全局环境
Reflect.defineProperty(window, 'app', {
  get() {
    return app
  }
})
