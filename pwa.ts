import { VitePWAOptions } from 'vite-plugin-pwa';

export const pwaOptions: VitePWAOptions = {
    registerType: 'autoUpdate',
    manifest: {
        name: '恋爱日常',
        short_name: '恋爱日常',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3367D6',
        icons: [
            { src: './src/assets/images/logo.png', sizes: '192x192', type: 'image/png' },
            { src: './src/assets/images/logo.png', sizes: '512x512', type: 'image/png' },
        ],
    },
    workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
    },
    injectRegister: null,
    minify: false,
    injectManifest: {}, // 修复为空对象而不是 undefined
    includeAssets: [], // 修复为空数组而不是 undefined
    includeManifestIcons: false,
    disable: false
};
