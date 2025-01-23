<template>
  <div style="height: 100%;">
    <van-pull-refresh v-model="pulling" @refresh="onRefresh">
      <div v-if="tableData.length === 0">
        <van-empty description="您的朋友圈空空如也~"></van-empty>
      </div>
      <van-list v-else v-model:loading="loading" :finished="finished" @load="onLoadMore" :error="loadError">
        <slot name="item" :tableData="tableData" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';

const props = defineProps({
  fetchDataFn: {
    type: Function as PropType<(page: number, pageSize: number) => Promise<any>>,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits();

// 数据、状态
const tableData = ref<any[]>([]);
const pulling = ref(false); // 控制下拉刷新状态
const loading = ref(false); // 控制加载更多的状态
const finished = ref(false); // 是否所有数据已经加载完
const loadError = ref(false); // 是否加载错误

// 当前页数
let currentPage = 1;

// 获取数据
const fetchData = async (isRefresh: boolean = false) => {
  if (isRefresh) {
    tableData.value = []; // 下拉刷新时清空数据
    finished.value = false;
    currentPage = 1;
  }
  console.log('11', 11)
  loading.value = true;
  // 调用父组件传入的接口方法获取数据
  const response = await props.fetchDataFn(currentPage, props.pageSize);
  tableData.value = [...tableData.value, ...response.rows];
  console.log("🚀 ~ fetchData ~ currentPage:", tableData.value)
  if (tableData.value.length >= response.total) {
    finished.value = true; // 数据为空时标记已加载完
  } else {
    currentPage++;
  }
  loading.value = false;
  pulling.value = false;
  console.log("🚀 ~ fetchData ~ pulling.value:", pulling.value)
};

// 下拉刷新事件
const onRefresh = async () => {
  if (loading.value) return; // 防止在加载中的时候重复刷新
  pulling.value = true;
  await fetchData(true);
  pulling.value = false;
};

// 加载更多事件
const onLoadMore = () => {
  if (finished.value) return; // 防止加载中或者已加载完时重复加载
  fetchData();
};
const deleteTableData = (id: number) => {
  tableData.value = tableData.value.filter((item) => item.id !== id);
}
// 在组件挂载时初始化请求
onMounted(() => {
  fetchData();
});

defineExpose({
  deleteTableData,
  fetchData
});
</script>
