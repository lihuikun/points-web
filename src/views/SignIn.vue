<!--
 * @Description: 签到页面
 * @Author: lihk
 * @Date: 2025-01-22 11:20:41
-->
<template>
  <div class="home-container">
    <div class="user-info">
      <div class="continuous-days">
        <div class="circle-text">
          <div class="title">连续签到</div>
          <span class="days">{{ continuousDays }}</span>
          <span class="label">天</span>
        </div>
      </div>

      <div class="points-info">
        <van-tag type="primary" size="large">当前积分: {{ points }}</van-tag>
      </div>
    </div>

    <div class="checkin-card">
      <van-card class="custom-card">
        <template #title>
          <div class="card-title">
            <van-icon name="gift-o" size="24" color="#ff6b6b" />
            <span>今日签到奖励</span>
          </div>
        </template>
        <template #desc>
          <div class="rewards-info">
            <p>连续签到奖励规则：</p>
            <p>3天：400积分</p>
            <p>7天：800积分</p>
            <p>15天：1000积分</p>
          </div>
        </template>
        <template #footer>
          <van-button :type="isCheckedIn ? 'default' : 'primary'" size="large" @click="handleCheckIn"
            :disabled="isCheckedIn" :loading="loading">
            {{ isCheckedIn ? '今日已签到' : '立即签到' }}
          </van-button>
        </template>
      </van-card>
    </div>

    <van-cell-group class="action-group">
      <van-cell title="查看历史记录" is-link to="/history" />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast, showDialog, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { checkIn, getUserInfo } from '../api/user'

const router = useRouter()
const points = ref(0)
const continuousDays = ref(0)
const isCheckedIn = ref(false)
const loading = ref(false)
const circleValue = ref(0)

const handleCheckIn = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await checkIn()
    if (res.code === 200) {
      showSuccessToast('签到成功')
      points.value = res.data.totalPoints
      continuousDays.value = res.data.continuousDays
      isCheckedIn.value = true
      circleValue.value = (continuousDays.value / 15) * 100
    } else {
      showToast(res.msg)
    }
  } catch (error) {
    showToast('签到失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const res = await getUserInfo()
  if (res.code === 200) {
    points.value = res.data.points
    continuousDays.value = res.data.continuousDays
    isCheckedIn.value = res.data.isCheckedIn
    circleValue.value = (continuousDays.value / 15) * 100
  }
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.user-info {
  padding: 20px;
  text-align: center;
  background: white;
  margin-bottom: 12px;
}

.continuous-days {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.continuous-days .title {
  font-size: 16px;
  color: #666;
}

.circle-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 24px;
}

.days {
  font-size: 28px;
  font-weight: bold;
  color: #1989fa;
  line-height: 1;
}

.label {
  font-size: 14px;
  color: #666;
  margin-left: 2px;
}

.points-info {
  margin-top: 16px;
}

.checkin-card {
  margin: 12px;
}

.custom-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #323233;
}

.rewards-info {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.action-group {
  margin-top: 12px;
}
</style>