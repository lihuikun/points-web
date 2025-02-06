<template>
  <div>
    <!-- 弹窗 -->
    <van-popup v-model:show="showPopup" position="bottom" :style="{ height: '80%' }">
      <div class="popup-container">
        <van-nav-bar title="发布朋友圈" left-text="取消" @click-left="closePopup" />
        <div class="content">
          <van-field v-model="content" type="textarea" placeholder="说点什么吧..." rows="2" autosize />
          <van-uploader v-model="images" :max-count="9" :after-read="afterUpload" multiple accept="image/*" />
          <van-field v-model="location" placeholder="请输入您的位置" />
        </div>
        <div class="actions">
          <van-button type="primary" :loading="loading" :disabled="loading" block @click="postToMoments">发布</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { showToast } from "vant";
import { useUploadImage } from "@/hooks/useUploadImage";
import { addPost } from "@/api/posts";

const showPopup = ref(false); // 控制弹窗显示
const content = ref(""); // 文本内容
const images = ref([]); // 图片列表
const userInfo = ref(JSON.parse(localStorage.getItem("userInfo") || "{}")); // 用户信息
const location = ref("");
const { loading, imageList, afterUpload } = useUploadImage();
// 打开弹窗
const openPopup = () => {
  showPopup.value = true;
};

// 关闭弹窗
const closePopup = () => {
  showPopup.value = false;
};
const emit = defineEmits(["refresh"]);
// 发布朋友圈
const postToMoments = async () => {
  if (!content.value && images.value.length === 0) {
    showToast("内容不能为空");
    return;
  }

  try {
    await addPost({
      userId: userInfo.value.id,
      content: content.value,
      images: imageList.value,
      location: location.value,
    });
    // 模拟发布逻辑
    showToast("发布成功");
    emit("refresh");
    closePopup();
  } catch (error) {
    showToast("发布失败");
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