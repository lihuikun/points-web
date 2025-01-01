<template>
  <div class="register-container">
    <div class="header">
      <van-icon name="user-circle-o" size="60" color="#fff" />
      <h2>用户注册</h2>
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[
            { required: true, message: '请填写邮箱' },
            { pattern: emailRegex, message: '请输入正确的邮箱格式' }
          ]"
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
          注册
        </van-button>
        <van-button round block plain to="/login" class="login-btn">
          返回登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { register } from '../api/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const onSubmit = async () => {
  try {
    loading.value = true
    const res = await register(email.value, password.value)
    if (res.code === 200) {
      Toast.success('注册成功',{duration:1000})
      router.push('/login')
    } else {
      Toast.fail(res.msg,{duration:3000})
    }
  } catch (error) {
    Toast.fail('注册失败',{duration:3000})
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
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

.login-btn {
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