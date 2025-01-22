<!--
 * @Description: 卡片翻转组件
 * @Author: lihk
 * @Date: 2025-01-22 11:19:49
-->
<template>
  <div class="flip-card" :class="{ flipped }" @click="toggleFlip">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <slot name="front">Front Content</slot>
      </div>
      <div class="flip-card-back">
        <slot name="back">Back Content</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const flipped = ref(false);

const toggleFlip = () => {
  flipped.value = !flipped.value;
};
</script>

<style scoped>
.flip-card {
  perspective: 1000px;
  width: 250px;
  height: 331px;
  cursor: pointer;
  overflow: hidden;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  border-radius: 10px;
  transition: background-color 0.6s ease-in-out;
  overflow: hidden;
}

/* 添加渐变背景和过渡动画 */
.flip-card-front {
  background: linear-gradient(135deg, #3498db, #85c1e9);
}

.flip-card-back {
  background: linear-gradient(135deg, #ff7e5f, #feb47b); 
  transform: rotateY(180deg);
}
</style>
