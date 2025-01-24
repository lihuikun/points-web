<template>
  <div>
    <!-- 弹窗 -->
    <van-popup v-model:show="showPopup" position="bottom" :style="{ height: '80%' }">
      <div class="popup-container">
        <van-nav-bar title="发布朋友圈" left-text="取消" @click-left="closePopup" />
        <div class="content">
          <van-field v-model="content" type="textarea" placeholder="说点什么吧..." rows="2" autosize />
          <van-uploader v-model="images" :max-count="9" :before-upload="beforeUpload" :after-upload="afterUpload" multiple
            accept="image/*" />
            <van-field v-model="location" placeholder="请输入您的位置" />
        </div>
        <div class="actions">
          <van-button type="primary" block @click="postToMoments">发布</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showToast } from 'vant';
import { addPost } from '@/api/posts'

const showPopup = ref(false); // 控制弹窗显示
const content = ref(''); // 文本内容
const images = ref([]); // 图片列表
const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}')); // 用户信息
const location = ref('');
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

// 图片上传后的钩子
const afterUpload = () => {
  showToast('图片上传成功');
};
const emit = defineEmits(['refresh'])
// 发布朋友圈
const postToMoments = async () => {
  if (!content.value && images.value.length === 0) {
    showToast('内容不能为空');
    return;
  }

  try {
    await addPost({
      userId: userInfo.value.id,
      content: content.value,
      images: images.value,
      location: location.value
    });
    // 模拟发布逻辑
    showToast('发布成功');
    emit('refresh')
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