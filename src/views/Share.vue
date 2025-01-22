<template>
  <div class="share-page">
    <div class="user-info">
      <img :src="userInfo.avatar || avatar" alt="好友头像" class="user-avatar">
      <div class="user-details">
        <p>好友 <span class="nickname">{{ userInfo.nickname }}</span> 喊你助力啦！</p>
      </div>
    </div>
    <div class="waves-box">
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28"
      preserveAspectRatio="none" shape-rendering="auto">
      <defs>
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </defs>
      <g class="parallax">
        <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
        <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
        <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
        <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
      </g>
    </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { share } from "@/api/user";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import avatar from '@/assets/img/avatar.jpg';

const route = useRoute();
const router = useRouter();
const userInfo = ref({
  avatar: "",
  nickname: ""
});

async function setShare() {
  const { msg, data } = await share(route.query);
  userInfo.value = data;
  showToast({
    message: msg,
    icon: data === "分享已过期" ? "fail" : "success",
    duration: 2000
  });
  if (data === "分享已过期") {
    setTimeout(() => {
      router.push("/home");
    }, 2000);
  }
}

function handleHelp() {
  showToast({
    message: "助力成功！",
    icon: "success",
    duration: 1500
  });
}

onMounted(() => {
  setShare();
});
</script>

<style lang="scss" scoped>
.share-page {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100vw;
  position: relative;
}

.share-header {
  margin-bottom: 20px;

  h1 {
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    color: #fff;
  }

  p {
    font-size: 16px;
    color: #dcdcdc;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
  z-index: 1;

  .user-avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin-bottom: 15px;
    border: 3px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .user-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      font-size: 22px;
      color: #fff;
      margin-bottom: 5px;
    }

    p {
      font-size: 14px;
      color: #dcdcdc;
    }
  }
}
.waves-box{
  position: absolute;
  bottom: 50px;
  width: 100%;
  height: 40px;
  z-index: 999;
}
.actions {
  width: 100%;
  max-width: 400px;

  .van-button {
    font-size: 18px;
    font-weight: bold;
  }
}

/* 波浪动画 */
.waves {
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: -7px; /*Fix for safari gap*/
    min-height: 100px;
    max-height: 150px;
}
 
/* Animation */
 
.parallax > use {
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
}
.parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
}
.parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
}
.parallax > use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
}
@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }
    100% {
        transform: translate3d(85px, 0, 0);
    }
}
/*Shrinking for mobile*/
@media (max-width: 768px) {
    .waves {
        height: 40px;
        min-height: 40px;
    }
    .content {
        height: 30vh;
    }
    h1 {
        font-size: 24px;
    }
}

.nickname {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}
</style>
