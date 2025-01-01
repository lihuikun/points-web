import request from '../utils/request'
import type { ApiResponse } from '../types'

export const login = (email: string, password: string) => {
  return request.post('/auth/login', { email, password })
}

export const register = (email: string, password: string) => {
  return request.post('/auth/register', { email, password })
} 