<template>
  <div class="history-container">
    <van-nav-bar
      title="积分历史"
      left-arrow
      @click-left="router.back()"
    />
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group inset v-for="item in list" :key="item.id">
          <van-cell :title="item.type" :value="`+${item.points}`">
            <template #label>
              <span>{{ item.date }}</span>
              <span class="continuous-days" v-if="item.continuousDays > 1">
                连续签到{{ item.continuousDays }}天
              </span>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getPointsHistory } from '../api/user'

const router = useRouter()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const list = ref<any[]>([])

const onLoad = async () => {
  try {
    const res = await getPointsHistory()
    if (res.code === 200) {
      list.value = [...list.value, ...res.data]
      finished.value = true
    }
  } catch (error) {
    showToast('获取历史记录失败')
  }
  loading.value = false
}

const onRefresh = () => {
  finished.value = false
  list.value = []
  onLoad()
  refreshing.value = false
}
</script>

<style scoped>
.history-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.continuous-days {
  margin-left: 10px;
  color: #1989fa;
  font-size: 12px;
}

:deep(.van-cell-group) {
  margin: 8px 12px;
}

:deep(.van-cell__value) {
  color: #07c160;
  font-weight: bold;
}
</style> 