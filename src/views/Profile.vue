<template>
  <div class="profile-container">
    <!-- 用户信息卡片 -->
    <div class="profile-content">
      <div class="user-card" @click="showEditDialog = true">
        <!-- <van-image round width="80" height="80" :src="userInfo.avatar || '@/assets/img/avatar.jpg'" /> -->
        <van-image round width="80" height="80" :src="userInfo.avatar || avatar" fit="cover" />
        <div class="user-info">
          <h3 class="nickname">{{ userInfo.nickname || userInfo.email?.split('@')[0] }}</h3>
          <p class="email">{{ userInfo.email }}</p>
          <div class="points-badge">
            <van-icon name="points" />
            <span>{{ userInfo.points }} 积分</span>
          </div>
        </div>
        <van-icon name="edit" class="edit-icon" />
      </div>

      <!-- 功能模块 -->
      <van-cell-group inset class="feature-group">
        <van-cell center title="连续签到" icon="clock-o" :value="`${userInfo.continuousDays}天`" />
        <van-cell center title="每日签到" icon="sign" is-link to="/sign-in">
          <template #right-icon>
            <van-tag type="primary" v-if="userInfo.isCheckedIn">已签到</van-tag>
            <van-tag type="warning" v-else>未签到</van-tag>
          </template>
        </van-cell>
        <van-cell center title="朋友圈" icon="friends-o" is-link to="/posts"></van-cell>
        <van-cell v-if="userInfo.role === '超级管理员'" center title="好友加积分" icon="friends-o" is-link @click="handleAddPoints"></van-cell>
        <van-cell center title="节日气氛" icon="gift-o" is-link to="/festive" />
      </van-cell-group>

      <van-cell-group inset class="feature-group">
        <van-cell center title="积分记录" icon="balance-list-o" is-link to="/history" />
        <van-cell center title="礼品兑换" icon="gift-o" is-link to="/lottery" />
      </van-cell-group>

      <van-cell-group inset class="feature-group">
        <van-cell center title="修改密码" icon="setting-o" is-link @click="showPasswordDialog = true" />
        <van-cell center title="退出登录" icon="close" @click="handleLogout" class="logout-cell" />
      </van-cell-group>

      <!-- 修改密码弹窗 -->
      <van-dialog v-model:show="showPasswordDialog" title="修改密码" show-cancel-button @confirm="handleChangePassword" :before-close="handlePasswordDialogClose">
        <van-form @submit.prevent>
          <van-field v-model="passwordForm.oldPassword" type="password" label="原密码" placeholder="请输入原密码" :rules="[{ required: true, message: '请输入原密码' }]" />
          <van-field v-model="passwordForm.newPassword" type="password" label="新密码" placeholder="请输入新密码" :rules="[{ required: true, message: '请输入新密码' }]" />
          <van-field v-model="passwordForm.confirmPassword" type="password" label="确认密码" placeholder="请再次输入新密码" :rules="[
            { required: true, message: '请确认新密码' },
            { validator: validatePassword, message: '两次输入的密码不一致' }
          ]" />
        </van-form>
      </van-dialog>

      <!-- 编辑用户信息弹窗 -->
      <van-dialog v-model:show="showEditDialog" title="编辑个人信息" show-cancel-button @confirm="handleUpdateInfo" :before-close="handleEditDialogClose">
        <van-form @submit.prevent>
          <van-field name="avatar" label="头像">
        <template #input>
          <van-uploader
            :after-read="afterUpload"
            accept="image/*"
          >
            <img
              :src="editForm.avatar ? editForm.avatar : avatar"
              class="avatar-preview"
              alt="头像"
            />
          </van-uploader>
        </template>
      </van-field>
          <van-field v-model="editForm.nickname" label="昵称" placeholder="请输入昵称" />
          <van-field v-model="editForm.email" label="邮箱" placeholder="请输入邮箱" :rules="[
            { required: true, message: '请填写邮箱' },
            { pattern: emailRegex, message: '请输入正确的邮箱格式' }
          ]" />
        </van-form>
      </van-dialog>
      <AddPoints ref="addPointsRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showToast, showDialog } from "vant";
import { getUserInfo, updateUserInfo } from "../api/user";
import type { UserInfo } from "../types";
import avatar from "@/assets/img/avatar.jpg";
import AddPoints from "@/components/AddPoints.vue";
import { addPic } from "@/api/posts";

const router = useRouter();
const userInfo = ref<UserInfo>(JSON.parse(localStorage.getItem("userInfo")));
const showPasswordDialog = ref(false);
const showEditDialog = ref(false);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const addPointsRef = ref<InstanceType<typeof AddPoints>>();

const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const editForm = ref({
  nickname: "",
  email: "",
  avatar: "",
});

const validatePassword = () => {
  return passwordForm.value.newPassword === passwordForm.value.confirmPassword;
};

const handlePasswordDialogClose = (action: string) => {
  if (action === "confirm") {
    // 这里添加修改密码的API调用
    showToast("密码修改功能开发中");
    return true;
  }
  passwordForm.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  return true;
};

const handleEditDialogClose = (action: string) => {
  if (action === "cancel") {
    editForm.value = {
      avatar: userInfo.value.avatar || "",
      nickname: userInfo.value.nickname || "",
      email: userInfo.value.email || "",
    };
  }
  return true;
};
const afterUpload = async (files) => {
  const formData = new FormData();
  console.log("🚀 ~ afterUpload ~ formData:", files)
   // 兼容单个文件和多个文件上传
   if (Array.isArray(files)) {
    files.forEach(f => {
      formData.append("files", f.file);
    });
  } else {
    formData.append("files", files.file);
  }

  // 调用后端接口上传图片
  const { data } = await addPic(formData);
  editForm.value.avatar = data.urls[0];
  console.log("🚀 ~ afterUpload ~ data:", data);
};
const handleChangePassword = () => {
  // 密码修改逻辑
};

function handleAddPoints() {
  addPointsRef.value.openPopup();
}
const handleLogout = () => {
  showDialog({
    title: "提示",
    message: "确定要退出登录吗？",
    showCancelButton: true,
  }).then((action) => {
    if (action === "confirm") {
      localStorage.removeItem("token");
      router.push("/auth");
    }
  });
};

const handleUpdateInfo = async () => {
  if (!emailRegex.test(editForm.value.email)) {
    showToast("请输入正确的邮箱格式");
    return;
  }

  try {
    const res = await updateUserInfo(editForm.value);
    if (res.code === 200) {
      showToast("更新成功");
      const userRes = await getUserInfo();
      // 将其存到本地缓存
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      if (userRes.code === 200) {
        userInfo.value = userRes.data;
      }
    } else {
      showToast(res.msg);
    }
  } catch (error) {
    showToast("更新失败");
  }
};

onMounted(async () => {
  try {
    const res = await getUserInfo();
    // 将其存到本地缓存
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    if (res.code === 200) {
      userInfo.value = res.data;
      editForm.value = {
        avatar: res.data.avatar || "",
        nickname: res.data.nickname || "",
        email: res.data.email || "",
      };
    }
  } catch (error) {
    showToast("获取用户信息失败");
  }
});
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.profile-content {
  padding: 16px;
  padding-bottom: 32px;
  max-width: 500px;
  margin: 0 auto;
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: white;
  position: relative;
  cursor: pointer;
}

.user-card:active {
  opacity: 0.8;
}

.user-info {
  margin-left: 16px;
  flex: 1;
}

.nickname {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 4px;
}

.email {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
  margin-bottom: 8px;
}

.points-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.points-badge .van-icon {
  margin-right: 4px;
  font-size: 16px;
}

.feature-group {
  margin-bottom: 12px;
}

/* 覆盖 van-cell-group--inset 的默认边距 */
:deep(.van-cell-group--inset) {
  margin: 0;
  margin-bottom: 20px;
}

.feature-group :deep(.van-cell) {
  align-items: center;
  padding: 16px;
}

.feature-group :deep(.van-cell__title) {
  display: flex;
  align-items: center;
}

.feature-group :deep(.van-cell__left-icon) {
  margin-right: 8px;
  font-size: 20px;
}

.logout-cell {
  color: #ee0a24;
}

.logout-cell :deep(.van-cell__left-icon) {
  color: #ee0a24;
}

.edit-icon {
  position: absolute;
  right: 16px;
  top: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
}
.avatar-preview{
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>