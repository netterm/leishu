import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import gzipPlugin from 'rollup-plugin-gzip'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import injectExternals from 'vite-plugin-inject-externals'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'
import server from './server'

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

export default ({ mode }) => {
  const isProd = mode === 'production' // 是否为生产环境
  console.log(isProd)

  return defineConfig({
    plugins: [
      vue(),
      vueJSX(),
      Components({
        resolvers: [VantResolver()]
      }),
      vueSetupExtend(),
      // 生产环境部分依赖的cdn加速
      injectExternals({
        injectTo:
          '<!-- Custom placeholder for vite plugin inject externals -->',
        modules: [
          // {
          //   name: 'vue',
          //   global: 'Vue',
          //   path: 'https://cdnjs.loli.net/ajax/libs/vue/3.2.36/vue.global.prod.min.js'
          // }
        ]
      }),
      WindiCSS()
    ],
    assetsInclude: ['**/*.(png|jpg|jpeg|svg|mp4|mp3)'],
    resolve: {
      extensions: ['.vue', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        '@': resolve('src'),
        '@style': resolve('src/assets/style')
      },
      mainFields: ['module', 'main', 'jsnext:main', 'jsnext']
    },
    server,
    build: {
      outDir: './微信公众号-智慧工地',
      polyfillDynamicImport: false, // 必须为false
      rollupOptions: {
        plugins: [
          // gzip压缩
          gzipPlugin({
            filter:
              /\.(js|mjs|cjs|json|css|html|wasm|png|jpg|jpeg|svg|mp4|mp3)$/
          })
        ],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
                .replace(/^\./, 'package.')
            }
          }
        }
      }
    }
  })
}
