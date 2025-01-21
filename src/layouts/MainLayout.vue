<template>
  <div class="layout-container">
    <!-- NavBar 头部导航栏 -->
    <van-nav-bar :title="title" left-arrow @click-left="$router.back()" />
    
    <!-- 内容区域（可滚动） -->
    <div class="content" style="flex: 1; overflow-y: auto;">
      <router-view />
    </div>

    <!-- TabBar 底部导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="gift-o" to="/lottery">抽奖</van-tabbar-item>
      <van-tabbar-item icon="todo-list-o" to="/tasks">任务</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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

// 通过路由动态获取标题
const title = computed(() => {
  switch (route.path) {
    case '/lottery':
      return '抽奖'
    case '/tasks':
      return '任务'
    case '/profile':
      return '我的'
    default:
      return '幸运抽奖'
  }
})
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.van-nav-bar {
  z-index: 10;
}

.van-tabbar {
  z-index: 10;
}
</style>
