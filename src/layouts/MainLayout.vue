<template>
  <div class="layout-container">
    <router-view />
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="gift-o" to="/lottery">抽奖</van-tabbar-item>
      <van-tabbar-item icon="todo-list-o" to="/tasks">任务</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)

// 监听路由变化，更新 active 值
watch(
  () => route.path,
  (path) => {
    switch (path) {
      case '/':
        active.value = 0
        break
      case '/lottery':
        active.value = 1
        break
      case '/tasks':
        active.value = 2
        break
      case '/profile':
        active.value = 3
        break
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  padding-bottom: 50px;
}
</style>