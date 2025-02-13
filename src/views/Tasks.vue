<template>
  <div class="tasks-container">
    <van-cell-group inset>
      <van-cell title="每日签到" :value="isCheckedIn ? '已完成' : '未完成'" to="/sign-in" />
      <van-cell title="分享任务" value="+10积分" @click="share" />
      <van-cell title="邀请好友" value="未完成" />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="幸运刮刮乐" to="/ticket" is-link />
      <van-cell title="礼品兑换" to="/gift" is-link />
    </van-cell-group>
    <Share v-model:show="showShare"></Share>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserInfo } from '../api/user'
import Share from '../components/Share.vue'

const isCheckedIn = ref(JSON.parse(localStorage.getItem('userInfo') || '{}').isCheckedIn || false)
const showShare = ref(false)

function share() {
  showShare.value = true
}
onMounted(async () => {
  const res = await getUserInfo()
  // 将其存到本地缓存
  localStorage.setItem('userInfo', JSON.stringify(res.data))
  if (res.code === 200) {
    isCheckedIn.value = res.data.isCheckedIn
  }
})
</script>

<style scoped>
.tasks-container {
  padding: 12px;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style> 