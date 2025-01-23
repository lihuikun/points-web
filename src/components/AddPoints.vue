<template>
  <div>
    <!-- 弹窗 -->
    <van-popup v-model:show="showPopup" position="bottom" :style="{ height: '80%' }">
      <div class="popup-container">
        <van-nav-bar title="为好友加积分" left-text="取消" @click-left="closePopup" />
        <div class="content">
          <van-field v-model="params.userId" placeholder="请输入用户ID" />
          <van-field v-model="params.type" placeholder="请输入积分类型" />
          <van-field v-model="params.points" placeholder="请输入积分" />
        </div>
        <div class="actions">
          <van-button type="primary" block @click="postToMoments">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showToast } from 'vant';
import { addPoints } from '@/api/user'

const showPopup = ref(false); // 控制弹窗显示
const params = ref({ userId: '', type: '', points: '' }); // 文本内容

const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}')); // 用户信息
// 打开弹窗
const openPopup = () => {
  showPopup.value = true;
};

// 关闭弹窗
const closePopup = () => {
  showPopup.value = false;
};

// 图片上传前的钩子
const beforeUpload = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        showToast('图片格式不支持');
        reject();
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};
// 发布朋友圈
const postToMoments = async () => {
  try {
    await addPoints(params.value);
    // 模拟发布逻辑
    showToast('添加积分成功');
    closePopup();
  } catch (error) {
    showToast('发布失败');
  }
};

// 暴露方法供父组件调用
defineExpose({
  openPopup,
});
</script>

<style lang="scss" scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  flex: 1;
  padding: 16px;
}

.actions {
  padding: 16px;
}
</style>