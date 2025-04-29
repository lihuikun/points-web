<script setup lang="ts">
import { onMounted } from 'vue'

// 检查是否从主屏幕启动
const isFromHomescreen = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches ||
         (window.navigator as any).standalone === true
}

// 请求全屏
const requestFullscreen = () => {
  const element = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if ((element as any).webkitRequestFullscreen) {
    (element as any).webkitRequestFullscreen()
  } else if ((element as any).mozRequestFullScreen) {
    (element as any).mozRequestFullScreen()
  } else if ((element as any).msRequestFullscreen) {
    (element as any).msRequestFullscreen()
  }
}

onMounted(() => {
  // 如果是从主屏幕启动，自动进入全屏
  if (isFromHomescreen()) {
    requestFullscreen()
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
