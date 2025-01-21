<!--
 * @Description: 抽奖历史记录
 * @Author: lihk
 * @Date: 2025-01-21 17:05:24
-->
<template>
  <div>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多抽奖记录了" @load="onLoad">
      <van-cell v-for="item in tableData" :key="item.id" :title="item.awardName" :label="`${item.drawDate}`"
        :value="getAwardValue(item)" />
    </van-list>
  </div>
</template>

<script lang='ts' setup>
import { getLotteryHistory } from '@/api/lottery'
const { tableData, finished, loading, params, prizes } = toRefs(
  reactive({
    tableData: [] as any[],
    finished: false,
    loading: false,
    params: {
      // 拿到本地存储的userId
      userId: JSON.parse(localStorage.getItem('userInfo')).id,
      page: 1,
      pageSize: 20
    },
    prizes: JSON.parse(localStorage.getItem('prizes'))
  })
)
async function onLoad() {
  const { data } = await getLotteryHistory(params.value)
  tableData.value = [...tableData.value, ...data.rows]
  params.value.page++
  if (tableData.value.length >= data.total) {
    finished.value = true
  } else {
    loading.value = false
  }
  console.log("🚀 ~ onLoad ~ tableData.value:", data)
}
function getAwardValue(item) {
  console.log('prizes.value', prizes.value)
  const award = prizes.value.find((ele) => ele.label === item.awardName)?.value
  console.log("🚀 ~ getAwardValue ~ award:", award)
  return item.awardValue ? `+${item.awardValue} 积分` : award
}
</script>
<style lang='scss' scoped></style>