<template>
  <div class="lottery-page">
    <van-nav-bar title="幸运抽奖" left-arrow @click-left="$router.back()" />

    <div class="lottery-content">
      <div class="points-display">
        <van-cell title="我的积分" :value="userPoints" />
        <van-cell title="抽奖消耗" :value="cost + '积分/次'" />
      </div>

      <div class="wheel-container">
        <LuckyWheel />
      </div>

      <div class="prize-rules">
        <van-collapse v-model="activeCollapse">
          <van-collapse-item title="抽奖规则" name="1">
            <p>1. 每次抽奖消耗 {{ cost }} 积分</p>
            <p>2. 奖品包含：</p>
            <ul>
              <li v-for="(prize, index) in prizes" :key="index">
                {{ prize.name }}
              </li>
            </ul>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LuckyWheel from '../components/LuckyWheel.vue'
import { getLotteryConfig } from '../api/lottery'
import type { LotteryConfig } from '../api/lottery'

const activeCollapse = ref(['1'])
const userPoints = ref(1000)
const cost = ref(200)
const prizes = ref<LotteryConfig['prizes']>([])

const initLotteryData = async () => {
  try {
    const { data } = await getLotteryConfig()
    prizes.value = data.prizes
    cost.value = data.cost
  } catch (error) {
    console.error('获取抽奖配置失败:', error)
  }
}

onMounted(() => {
  initLotteryData()
})
</script>

<style scoped>
.lottery-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.lottery-content {
  padding: 16px;
}

.points-display {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.wheel-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.prize-rules {
  margin-top: 20px;
}

.prize-rules p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.prize-rules ul {
  padding-left: 20px;
  margin: 8px 0;
}

.prize-rules li {
  color: #666;
  font-size: 14px;
  margin: 4px 0;
}
</style>