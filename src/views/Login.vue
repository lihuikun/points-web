<template>
  <div class="login-container">
    <div class="header">
      <van-image
        round
        width="100"
        height="100"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <h2>每日签到</h2>
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
        >
          <template #left-icon><van-icon name="envelop-o" /></template>
        </van-field>
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #left-icon><van-icon name="lock" /></template>
        </van-field>
      </van-cell-group>
      <div class="button-group">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          登录
        </van-button>
        <van-button round block plain to="/register" class="register-btn">
          注册账号
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { login } from '../api/auth'
import type { LoginResponse } from '../api/types'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const onSubmit = async () => {
  try {
    loading.value = true
    const res = await login(email.value, password.value)
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token)
      Toast.success('登录成功',{duration:1000})
      router.push('/')
    } else {
      Toast.fail(res.msg,{duration:3000})
    }
  } catch (error) {
    Toast.fail('登录失败',{duration:3000})
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  color: white;
  margin-top: 15px;
}

.button-group {
  margin: 16px;
}

.register-btn {
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.van-cell-group) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

:deep(.van-field) {
  background: transparent;
}

:deep(.van-field__label) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.van-field__control) {
  color: white;
}
</style>