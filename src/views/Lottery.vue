<template>
  <div class="lottery-page">
    <div class="lottery-content">
      <div class="points-display">
        <van-cell title="我的积分" :value="userInfo.points" />
        <van-cell title="抽奖消耗" :value="cost + '积分/次'" />
        <van-cell title="抽奖历史" is-link @click="() => $router.push('/lottery-history')"/>
      </div>

      <div class="wheel-container">
        <LuckyWheel v-model:userInfo="userInfo" :prizes="prizes"/>
      </div>

      <div class="prize-rules">
        <van-collapse v-model="activeCollapse">
          <van-collapse-item title="抽奖规则" name="1">
            <p>1. 每次抽奖消耗 {{ cost }} 积分</p>
            <p>2. 奖品包含：</p>
            <ul>
              <span v-for="(prize, index) in prizes" :key="index" style="margin-right: 5px;">
                {{ prize.value }}
              </span>
            </ul>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LuckyWheel from '../components/LuckyWheel.vue'
import { getLotteryConfig } from '../api/lottery'
import { getUserInfo } from '../api/user'
import type { UserInfo } from '../types'

const activeCollapse = ref(['1'])
const userInfo = ref<UserInfo>({
points: 0,
id: 0,
email: '',
isCheckedIn: false,
continuousDays: 0
})
// 奖品列表
const prizes = ref([
  { label: '一等奖', value: 'iphone手机', index: 0 },
  { label: '二等奖', value: '黄金1g', index: 1 },
  { label: '三等奖', value: '惊喜礼物', index: 2 },
  { label: '四等奖', value: '52元', index: 3 },
  { label: '', value: '' }, // 中间按钮位置
  { label: '五等奖', value: '彩票一张', index: 5 },
  { label: '六等奖', value: '13.14元', index: 6 },
  { label: '七等奖', value: '5.20元', index: 7 },
  { label: '八等奖', value: '随机积分', index: 8 },
])
const cost = ref(200)
// const initLotteryData = async () => {
//   try {
//     const { data } = await getLotteryConfig()
//     prizes.value = data.prizes
//     cost.value = data.cost
//   } catch (error) {
//     console.error('获取抽奖配置失败:', error)
//   }
// }
async function getUser() {
  const { data } = await getUserInfo()
  userInfo.value = data!
}
onMounted(() => {
  // initLotteryData()
  getUser()
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