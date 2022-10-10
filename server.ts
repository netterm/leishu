import { ServerOptions } from 'vite'

export default {
  port: 8080,
  open: '/queryError',
  proxy: {
    // '/center-wechat': {
    //   target: 'http://192.168.8.105:9600/',
    //   changeOrigin: true
    // },
    // '/center-business': {
    //   target: 'http://192.168.0.187:9100/',
    //   changeOrigin: true
    // },
    '^/center/': {
      target: 'http://center.hgyun.net:99/',
      changeOrigin: true
    },
    '^/center-': {
      target: 'http://center.hgyun.net:99/',
      changeOrigin: true,
      rewrite: path => '/center' + path
    }
  }
} as ServerOptions
