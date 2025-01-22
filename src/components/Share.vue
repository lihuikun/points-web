<template>
  <div class="app">
    <van-dialog v-model:show="showDialog" title="生成分享海报" show-confirm-button show-cancel-button @confirm="downloadImage" @cancel="copyUrl" cancelButtonText="复制链接" confirmButtonText="下载图片">
      <div ref="contentToImage" class="content" :style="{ backgroundImage: `url(${weatherInfo.imageUrl})` }">
        <div class="qrcode-box">
          <Qrcode :value="qrcodeUrl" :size="50"/>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts" setup>
import Qrcode from 'qrcode.vue';
import html2canvas from 'html2canvas';
import { getWeather, Weather } from '@/api/weather'
import { showToast } from 'vant';

// 弹窗的显示状态
const props = defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
}>()
const showDialog = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
});

// 拿到顶层url的前缀域名
const url = window.location.href.split('#')[0];
// 拿到用户的Id
const userId = JSON.parse(localStorage.getItem('userInfo') || '{}').id;
// 拿到今天的日期
const today = new Date().toISOString().split('T')[0];
// 生成二维码的地址
const qrcodeUrl = `${url}#/share?id=${userId}&date=${today}`;

const weatherInfo = ref(JSON.parse(localStorage.getItem(`${today}-weatherInfo`)))
const contentToImage = ref(null)
const downloadImage = () => {
  html2canvas(contentToImage.value, {
    useCORS: true,
    allowTaint: true,
  }).then((canvas) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = `${today}.png`;  // 下载的文件名
    link.click();
  }).catch((error) => {
    console.error('生成图片时出错:', error);
  });
};
async function copyUrl(){
  if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(qrcodeUrl);
      showToast('复制成功');
    } else {
      // 使用备用方案
      fallbackCopyTextToClipboard(qrcodeUrl);
    }
  showToast('复制成功')
}
// 备用方法（保证兼容性）
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // 隐藏文本框
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';

  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    showToast('复制成功');
  } catch (err) {
    console.error('备用复制方法失败', err);
    showToast('复制失败，请手动复制');
  }

  document.body.removeChild(textArea);
}
onMounted(async () => {
  if (!weatherInfo.value) {
    const { data } = await getWeather({ cityCode: '101280601' })
    weatherInfo.value = data
    localStorage.setItem(`${today}-weatherInfo`, JSON.stringify(data))
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.van-dialog__content) {
  display: flex;
  justify-content: center;
}

.content {
  margin-top: 20px;
  padding: 20px;
  position: relative;
  background-size: cover;
  width: 250px;
  height: 321px;

  .qrcode-box {
    position: absolute;
    padding: 4px;
    background-color: #fff;
    bottom: 20px;
    right: 20px;
  }
}

.qrcode {
  margin-bottom: 20px;
}

.van-button {
  margin-top: 10px;
}
</style>
