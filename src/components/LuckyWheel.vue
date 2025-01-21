<template>
  <div class="lottery">
    <div class="lottery-wrapper">
      <div class="grid">
        <div v-for="(item, index) in prizes" :key="index" :class="['grid-item', { active: index === activeIndex }]"
          @click="index === 4 ? startLottery() : null">
          <template v-if="index === 4">
            <div class="start-btn" :class="{ 'is-running': isRunning }">
              {{ isRunning ? '抽奖中...' : '开始抽奖' }}
            </div>
          </template>
          <template v-else>
            <div class="prize-content">
              <div class="prize-name">{{ item.label }}</div>
              <div class="prize-value" v-if="item.value">{{ item.value }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { drawLottery } from '../api/lottery'
import type { UserInfo } from '../types';
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
const props = defineProps<{
  userInfo: UserInfo,
  prizes: any[]
}>()
const emit = defineEmits(['update:userInfo'])
const userInfo = computed<UserInfo>({
  get: () => props.userInfo,
  set: (val: UserInfo) => emit('update:userInfo', val)
});
const activeIndex = ref<number | null>(null)
const isRunning = ref(false)
const startLottery = async () => {
  if (isRunning.value) return
  if (userInfo.value.points < 200) return showToast({
    message: '积分不足200，请先签到或做任务获取积分',
    position: 'middle',
    duration: 2000
  })
  // 调用后端接口
  const { data } = await drawLottery({ userId: userInfo.value.id.toString() })
  console.log("🚀 ~ interval ~ res:", data)

  isRunning.value = true
  let times = 0
  let currentIndex = 0
  const interval = setInterval(async () => {
    // 按照顺序循环亮起格子：0->1->2->5->8->7->6->3->0...
    const order = [0, 1, 2, 5, 8, 7, 6, 3]
    activeIndex.value = order[currentIndex]
    currentIndex = (currentIndex + 1) % order.length
    times++

    // 停止条件
    if (times > 24) { // 确保至少转3圈
      clearInterval(interval)
      isRunning.value = false

      const randomIndex = prizes.value.find(item => item.label === data!.name)?.index!
      activeIndex.value = randomIndex as number
      userInfo.value.points = data!.points

      // 显示中奖信息
      const prize = prizes.value[randomIndex as number]
      const str = `恭喜获得${data.name}: ${data.value ? `${data.value}积分` : prize.value}`
      console.log("🚀 ~ interval ~ str:", str, data)
      showToast({
        message: str,
        position: 'middle',
        duration: 2000
      })
    }
  }, 100)
}
</script>

<style scoped>
.lottery {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottery-wrapper {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.grid {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.grid-item {
  position: relative;
  background: white;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  max-height: 95px;
}

.grid-item.active {
  background: rgba(255, 228, 230, 0.95);
  transform: scale(0.95);
  box-shadow: 0 0 15px rgba(255, 77, 79, 0.3);
  border: 1px solid rgba(255, 77, 79, 0.2);
}

.prize-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  width: 100%;
}

.prize-name {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.prize-value {
  font-size: 13px;
  color: #ff4d4f;
  font-weight: 500;
  letter-spacing: 0.3px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.start-btn {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  text-shadow: none;
}

.start-btn:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 79, 0.4);
}

.start-btn.is-running {
  animation: pulse 1s infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(255, 77, 79, 0.3);
  }

  50% {
    transform: scale(0.95);
    box-shadow: 0 8px 25px rgba(255, 77, 79, 0.5);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(255, 77, 79, 0.3);
  }
}

/* 添加玻璃拟态效果的动画 */
@keyframes glowing {
  0% {
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  }

  50% {
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.6);
  }

  100% {
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  }
}

.lottery-wrapper {
  animation: glowing 3s infinite;
}
</style>
