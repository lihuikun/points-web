<template>
  <div class="auth-container">
    <div class="header">
      <van-image round width="100" height="100" :src="avatar" />
      <h2>每日签到</h2>
    </div>
    <van-tabs v-model:active="active" animated>
      <van-tab title="登录">
        <van-form @submit="onLogin">
          <van-cell-group inset>
            <van-field v-model="loginForm.email" name="email" placeholder="请输入邮箱"
              :rules="[{ required: true, message: '请填写邮箱' }]">
              <template #left-icon>
                <van-icon name="envelop-o" class="field-icon" />
              </template>
            </van-field>
            <van-field v-model="loginForm.password" type="password" name="password" placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]">
              <template #left-icon>
                <van-icon name="lock" class="field-icon" />
              </template>
            </van-field>
          </van-cell-group>
          <div class="button-group">
            <van-button round block type="primary" native-type="submit" :loading="loading">
              登录
            </van-button>
          </div>
        </van-form>
      </van-tab>
      <van-tab title="注册">
        <van-form @submit="onRegister">
          <van-cell-group inset>
            <van-field v-model="registerForm.email" name="email" placeholder="请输入邮箱" :rules="[
              { required: true, message: '请填写邮箱' },
              { pattern: emailRegex, message: '请输入正确的邮箱格式' }
            ]">
              <template #left-icon>
                <van-icon name="envelop-o" class="field-icon" />
              </template>
            </van-field>
            <van-field v-model="registerForm.password" type="password" name="password" placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]">
              <template #left-icon>
                <van-icon name="lock" class="field-icon" />
              </template>
            </van-field>
          </van-cell-group>
          <div class="button-group">
            <van-button round block type="primary" native-type="submit" :loading="loading">
              注册
            </van-button>
          </div>
        </van-form>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast, showSuccessToast } from 'vant'
import { login, register } from '../api/auth'
import avatar from '@/assets/img/avatar.jpg';
const router = useRouter()
const active = ref(0)
const loading = ref(false)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  password: ''
})

const onLogin = async () => {
  try {
    loading.value = true
    showLoadingToast({
      message: '登录中...',
      forbidClick: true,
      duration: 0
    })
    const res = await login(loginForm.value.email, loginForm.value.password)
    console.log("🚀 ~ onLogin ~ res:", res)
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token)
      console.log("🚀 ~ onLogin ~ res.data.token:", res.data.token)
      showSuccessToast({
        message: '登录成功',
        duration: 2000,
        onClose: () => {
          router.push('/home')
        }
      })
    } else {
      showToast({
        message: res.msg,
        icon: 'fail',
        duration: 2000
      })
    }
  } catch (error) {
    console.log("🚀 ~ onLogin ~ res.data.token:", error)

    showToast({
      message: '登录失败',
      icon: 'fail',
      duration: 2000
    })
  } finally {
    loading.value = false
    closeToast()
  }
}

const onRegister = async () => {
  try {
    loading.value = true
    showLoadingToast({
      message: '注册中...',
      forbidClick: true,
      duration: 0
    })
    const res = await register(registerForm.value.email, registerForm.value.password)
    if (res.code === 200) {
      showSuccessToast({
        message: '注册成功',
        duration: 2000
      })
      loginForm.value = {
        email: registerForm.value.email,
        password: registerForm.value.password
      }
      registerForm.value = { email: '', password: '' }
      active.value = 0
      showToast({
        message: '请使用注册账号进行登录',
        position: 'bottom',
        duration: 2000
      })
    } else {
      showToast({
        message: res.msg,
        icon: 'fail',
        duration: 2000
      })
    }
  } catch (error) {
    showToast({
      message: '注册失败',
      icon: 'fail',
      duration: 2000
    })
  } finally {
    loading.value = false
    closeToast()
  }
}
</script>

<style scoped>
.auth-container {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin: 30px 0;
}

.header h2 {
  color: white;
  margin-top: 15px;
}

.button-group {
  margin: 16px;
}

:deep(.van-tabs__wrap) {
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

:deep(.van-tabs__nav) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.van-tabs__content),
:deep(.van-tabs__track) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0 0 8px 8px;
}

:deep(.van-tab) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.van-tab--active) {
  color: white;
}

:deep(.van-tabs__line) {
  background-color: white;
}

:deep(.van-cell-group) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 20px;
}

:deep(.van-field) {
  background: transparent;
}

:deep(.van-field__label) {
  display: none;
}

:deep(.van-field__control) {
  color: white;
}

:deep(.field-icon) {
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
}

:deep(.van-field__left-icon) {
  margin-right: 10px;
}

:deep(.van-cell) {
  background: transparent;
  padding: 16px;
}

:deep(.van-field__placeholder) {
  color: rgba(255, 255, 255, 0.5);
}
</style>