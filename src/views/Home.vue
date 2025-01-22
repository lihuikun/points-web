<template>
  <div class="home-container">
    <FlipCard>
      <template #front>
        <div class="front-card" :style="{ 'background-image': `url(${cardData?.imageUrl})` }">
          <!-- <img class="img-card" :src="cardData.imageUrl" alt=""> -->
          <van-button class="btn" color="linear-gradient(to right, #ff6034, #ee0a24)" round size="small">
            翻转查看天气
          </van-button>
        </div>
      </template>
      <template #back>
        <div class="back-card">
          <p>{{ cardData?.city }}</p>
          <p>{{ cardData.weather }}</p>
          <p>{{ cardData.temperature }}</p>
        </div>
      </template>
    </FlipCard>
  </div>
</template>

<script lang="ts" setup>
import FlipCard from '@/components/FlipCard.vue';
import { getWeather, Weather } from '@/api/weather'
const today = new Date().toISOString().split('T')[0]
const cardData = ref<Weather>(JSON.parse(localStorage.getItem(`${today}-weatherInfo`)) || {})
function getWeatherData() {
  getWeather({ cityCode: '101280601' }).then(({ data }) => {
    cardData.value = data
    localStorage.setItem(`${today}-weatherInfo`, JSON.stringify(data))
  })
}
onMounted(() => {
  if (Object.keys(cardData.value).length === 0) getWeatherData()
})
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100vw;
  background: linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb);
  ;
  backdrop-filter: blur(10px);
  /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px);
  /* 支持 Safari */
  position: relative;
  /* 确保毛玻璃效果只应用在背景 */
  color: #fff;
  /* 文本颜色 */
}

.img-card {
  width: 100%;
  height: 100%;
}

.back-card {
  padding: 0 15px;
}

.front-card {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;

  .btn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
}

/* 卡片的容器，带有半透明背景 */
.flip-card {
  background: rgba(255, 255, 255, 0.1);
  /* 半透明背景 */
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  /* 轻微的毛玻璃效果 */
  -webkit-backdrop-filter: blur(8px);
  /* 支持 Safari */
}

/* 前卡片的内容 */
.flip-card-front {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 后卡片的内容 */
.flip-card-back {
  background: linear-gradient(135deg, #89f7fe, #66a6ff);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
