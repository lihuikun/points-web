import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
    onNeedRefresh() {
        // 显示更新提示
        if (confirm('新版本已经准备就绪，是否更新？')) {
            updateSW(true)
        }
    },
    onOfflineReady() {
        console.log('应用已经可以离线使用')
    },
    immediate: true
}) 