import axios from 'axios';
import type { AxiosResponse } from 'axios';
interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

const request = axios.create({
  //使用vite的代理的/api
  baseURL: '/api',
  timeout: 5000
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
  (response: AxiosResponse<ApiResponse>) => response,
  error => {
    return Promise.reject(error)
  }
)

export default request