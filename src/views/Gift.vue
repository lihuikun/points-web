<template>
  <div></div>
</template>

<script lang='ts' setup>
import { ref, reactive, onMounted, toRefs, watchEffect } from 'vue';
const { tableData } = toRefs(
  reactive({
   tableData: [] as any[],
})
)

onMounted(() => {
  console.log('tableData:', tableData.value);
})

watchEffect(() => {
  console.log('tableData:', tableData.value);
})

</script>
<style lang='scss' scoped>
</style>