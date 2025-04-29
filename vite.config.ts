import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import AutoImport from "unplugin-auto-import/vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log(env)
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue"],
        dts: "src/auto-imports.d.ts", // 指定生成的类型声明文件路径
        eslintrc: {
          enabled: true, // 如果使用 ESLint，开启此选项
          filepath: "./.eslintrc-auto-import.json",
        },
      }),
      Components({
        resolvers: [VantResolver()]
      }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: '恋爱日常',
          short_name: '恋爱日常',
          description: '恋爱日常系统',
          theme_color: '#ffffff',
          start_url: '/',
          display: 'fullscreen',
          background_color: '#ffffff',
          orientation: 'portrait',
          icons: [
            {
              src: '/icon.png',
              sizes: '200x200',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
