import axios from 'axios';
import type { AxiosResponse } from 'axios';

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
  (response: AxiosResponse) => response.data,
  error => {
    return Promise.reject(error)
  }
)

export default request