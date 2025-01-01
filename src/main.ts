import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 引入 Vant
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)  // 注册 Vant

app.mount('#app')
