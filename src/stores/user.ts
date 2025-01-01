import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '../types'
import { getUserInfo } from '../api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      if (res.code === 200) {
        userInfo.value = res.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  return {
    userInfo,
    fetchUserInfo
  }
}) 