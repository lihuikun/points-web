<template>
  <div class="tasks-container">
    <van-nav-bar title="每日任务" />
    <van-cell-group inset>
      <van-cell title="每日签到" :value="isCheckedIn ? '已完成' : '未完成'" />
      <van-cell title="分享任务" value="未完成" />
      <van-cell title="邀请好友" value="未完成" />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserInfo } from '../api/user'

const isCheckedIn = ref(false)

onMounted(async () => {
  const res = await getUserInfo()
  if (res.code === 200) {
    isCheckedIn.value = res.data.isCheckedIn
  }
})
</script>

<style scoped>
.tasks-container {
  padding: 12px;
  background: #f7f8fa;
  min-height: 100vh;
}
</style> 