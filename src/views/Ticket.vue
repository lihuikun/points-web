<!--
 * @Description: 刮刮乐列表
 * @Author: lihk
 * @Date: 2025-01-21 17:05:24
-->
<template>
  <div class="lottery-container">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多抽奖记录了" @load="onLoad">
      <van-cell v-for="item, index in tableData" :key="item.id" :title="`彩票编号：${index + 1}`"
        :label="formatDate(item.drawDate)" :value="getAwardValue(item)" :class="getCellClass(item)"
        @click="openTicketCanvas(item)" />
    </van-list>
    <van-dialog v-model:show="showScratch" title="刮刮乐" @confirm="confirm">
      <TicketCanvas ref="TicketsCanvasRef" :radius="5" :scratchRadius="20" :scratchPercent="100">
        <div class="prize">
          <div v-for="item, index in prizeInfo.breakdown" :key="index" class="prize-item">
            <span v-if="item !== 0">{{ item }}</span>
            <van-icon name="gift-o" v-else />
          </div>
        </div>
      </TicketCanvas>
    </van-dialog>
  </div>
</template>

<script lang='ts' setup>
import { regenerate, exchange, getTickets } from '@/api/ticket'
import TicketCanvas from '@/components/TicketCanvas.vue'
import { formatDate } from '@/utils/time'
import { showToast } from 'vant'
const { tableData, finished, loading, userInfo, } = toRefs(
  reactive({
    tableData: [] as any[],
    finished: false,
    loading: false,
    userInfo: JSON.parse(localStorage.getItem('userInfo')),
    prizes: JSON.parse(localStorage.getItem('prizes')),

  })
)
const prizeInfo = ref<{ breakdown: number[], prizeAmount: number }>({
  breakdown: [],
  prizeAmount: 0
})
const showScratch = ref(false); // 是否显示刮刮乐
const TicketsCanvasRef = ref(null)
async function onLoad() {
  const { data } = await getTickets()
  tableData.value = data
}
function getAwardValue(item) {
  return item.scratched ? "🎉 已中奖 " + item.prizeAmount + '积分' : "🎭 未刮开";
}
function getCellClass(item) {
  return item.scratched ? "scratched-style" : "unscratched-style";
}
async function openTicketCanvas(item) {
  console.log("🚀 ~ openTicketCanvas ~ item:", item)
  if (userInfo.value.points < 300) return showToast({ message: '积分不足300，无法刮奖', type: 'fail' })
  prizeInfo.value = item
  console.log("🚀 ~ openTicketCanvas ~ prizeInfo.value:", prizeInfo.value)
  if (item.scratched) return
  await exchange({ userId: userInfo.value.id, ticketId: item.id })
  showScratch.value = true;
}
async function confirm() {
  TicketsCanvasRef.value?.reset()
  showToast({
    message: `恭喜，${prizeInfo.value.prizeAmount}积分已发放`,
    type: 'success'
  })
  await onLoad()
  showScratch.value = false;
}
</script>
<style lang='scss' scoped>
.lottery-container {
  padding: 16px;
  background-color: #f5f5f5;
}

.scratched-style {
  background: linear-gradient(145deg, #ffd700, #c49b00);
  color: white;
  font-weight: bold;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
  transform: scale(1.01);
  transition: all 0.3s ease-in-out;
}

.unscratched-style {
  background: linear-gradient(145deg, #3a3a3a, #2c2c2c);
  color: #bbb;
  font-weight: bold;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.unscratched-style::before {
  content: "刮开看看 🎭";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.4);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: opacity 0.3s ease-in-out;
}

.unscratched-style:hover {
  background: linear-gradient(145deg, #4a4a4a, #363636);
  transform: scale(1.02);
}

.van-cell {
  padding: 16px;
}

.prize {
  width: 100%;
  max-width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;

  .prize-item {
    display: flex;
    width: 20%;
    align-items: center;
    justify-content: center;
  }
}
</style>