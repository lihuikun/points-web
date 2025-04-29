import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './pwa'

// 引入 Vant
import Vant from 'vant'
import 'vant/lib/index.css'
import "vant/es/toast/style"
import "vant/es/dialog/style"
import "vant/es/image-preview/style"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)  // 注册 Vant

app.mount('#app')
