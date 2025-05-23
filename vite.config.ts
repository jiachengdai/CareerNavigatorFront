import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入svg需要的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [vue(),
  // 跨域问题
  createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    symbolId: 'icon-[dir]-[name]',
  }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:8080',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/,'')
      }
    }
  },
  base: './',
  mode: 'development',
  worker: {
    format: 'es',
  },
})
