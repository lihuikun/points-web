<template>
  <div class="layout-container">
    <!-- NavBar 头部导航栏 -->
     <div class="nav-bar">
       <van-nav-bar v-if="title" :title="title" left-arrow @click-left="$router.back()" />
     </div>
    
    <!-- 内容区域（可滚动） -->
    <div class="content">
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
  return route.meta.title
})
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}

.content {
  flex: 1;
  padding-bottom: 50px;
  overflow-y: auto;
}

.nav-bar {
  width: 100%;
}
</style>
