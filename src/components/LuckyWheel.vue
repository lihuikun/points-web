<template>
    <div class="lottery-container">
        <div class="wheel-wrapper">
            <div class="wheel" :style="{ transform: `rotate(${rotation}deg)` }" :class="{ spinning: isSpinning }">
                <div v-for="(prize, index) in prizes" :key="index" class="prize-item" :style="{
                    transform: `rotate(${index * (360 / prizes.length)}deg)`,
                    backgroundColor: prize.color
                }">
                    <span class="prize-text">{{ prize.name }}</span>
                </div>
            </div>

            <div class="pointer"></div>
        </div>

        <van-button type="primary" size="large" class="draw-button" :disabled="isSpinning" @click="handleLottery">
            开始抽奖
        </van-button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast, showDialog } from 'vant'
import { startLottery, getLotteryConfig } from '../api/lottery'
import type { LotteryConfig } from '../api/lottery'

const props = defineProps<{
    userPoints?: number
}>()

const emit = defineEmits<{
    (e: 'update:points', points: number): void
}>()

const prizes = ref<LotteryConfig['prizes']>([])
const rotation = ref(0)
const isSpinning = ref(false)

const initLotteryConfig = async () => {
    prizes.value = [{
        name: '一等奖',
        probability: 0.1,
        color: '#FFD700'
    }, {
        name: '二等奖',
        probability: 0.2,
        color: '#FFA500'
    }, {
        name: '三等奖',
        probability: 0.3,
        color: '#FF4500'
    }, {
        name: '四等奖',
        probability: 0.4,
        color: '#FF4500'
    }, {
        name: '五等奖',
        probability: 0.5,
        color: '#FF4500'
    }, {
        name: '六等奖',
        probability: 0.6,
        color: '#FF4500'
    }, {
        name: '七等奖',
        probability: 0.7,
        color: '#FF4500'
    }, {
        name: '八等奖',
        probability: 0.8,
        color: '#FF4500'
    }, {
        name: '九等奖',
        probability: 0.9,
        color: '#FF4500'
    }, {
        name: '十等奖',
        probability: 1,
        color: '#FF4500'
    }]
    // try {
    //     const response = await getLotteryConfig()
    // } catch (error) {
    //     showToast('获取抽奖配置失败')
    // }
}

const handleLottery = async () => {
    if (isSpinning.value) return

    try {
        isSpinning.value = true
        const response = await startLottery()
        const result = response.data.data

        const targetDegree = 360 * 5 + (360 / prizes.value.length) * result.prizeIndex
        rotation.value = targetDegree
        emit('update:points', result.remainingPoints)

        setTimeout(() => {
            isSpinning.value = false
            showDialog({
                title: '恭喜',
                message: `获得${result.prizeName}`,
            })
        }, 4000)
    } catch (error) {
        isSpinning.value = false
        showToast('抽奖失败')
    }
}

onMounted(() => {
    initLotteryConfig()
})
</script>

<style scoped>
.lottery-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.wheel-wrapper {
    position: relative;
    width: 300px;
    height: 300px;
}

.wheel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    border: 8px solid #f1c40f;
    transition: transform 4s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.spinning {
    pointer-events: none;
}

.prize-item {
    position: absolute;
    width: 50%;
    height: 50%;
    transform-origin: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.prize-text {
    transform: rotate(90deg);
    white-space: nowrap;
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.pointer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    background: #e74c3c;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    z-index: 1;
}

.draw-button {
    width: 200px;
    height: 50px;
    border-radius: 25px;
}
</style>