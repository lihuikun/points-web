import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter(); 
const request = axios.create({
  //使用vite的代理的/api
  baseURL: '/api',
  timeout: 500000
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    // 检查是否是 401 错误
    if (error.response?.status === 401) {
      // 清除 token
      localStorage.removeItem('token');
      // 跳转到登录页面
      router.push('/auth');
    }
    return Promise.reject(error)
  }
)

export default request