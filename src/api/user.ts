import type { ApiResponse } from '../types'
import request from '../utils/request'

export const checkIn = () => {
  return request.post('/checkin')
}

export const getUserInfo = (): Promise<ApiResponse<any>> => {
  return request.get('/user/info')
}

export const getPointsHistory = (): Promise<ApiResponse<any>> => {
  return request.get('/points/history')
}

export const updateUserInfo = (data: { nickname?: string; email?: string }): Promise<ApiResponse<any>> => {
  return request.put('/user/info', data)
} 