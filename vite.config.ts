import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://lihk.serv00.net:13381/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 可选：重写路径
      }
    }
  }
})
