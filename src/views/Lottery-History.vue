<!--
 * @Description: 抽奖历史记录
 * @Author: lihk
 * @Date: 2025-01-21 17:05:24
-->
<template>
  <div>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多抽奖记录了" @load="onLoad">
      <van-cell v-for="item in tableData" :key="item.id" :title="item.awardName" :label="`${item.drawDate}`" :value="item.awardValue ? `+${item.awardValue} 积分` : ''"/>
    </van-list>
  </div>
</template>

<script lang='ts' setup>
import { getLotteryHistory } from '@/api/lottery'
const { tableData, finished, loading, params } = toRefs(
  reactive({
    tableData: [] as any[],
    finished: false,
    loading: false,
    params: {
      // 拿到本地存储的userId
      userId: JSON.parse(localStorage.getItem('userInfo')).id,
      page: 1,
      pageSize: 10
    }
  })
)
async function onLoad() {
  const { data } = await getLotteryHistory(params.value)
  tableData.value = data
  if(data.length < params.value.pageSize) {
    finished.value = true
  } else {
    params.value.page++
  }
  console.log("🚀 ~ onLoad ~ tableData.value:", tableData.value)
}

</script>
<style lang='scss' scoped></style>