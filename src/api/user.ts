import type { ApiResponse, UserInfo } from '../types'
import request from '../utils/request'

export const checkIn = (): Promise<ApiResponse<any>> => {
  return request.post('/checkin')
}

export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return request.get('/user/info')
}

export const getPointsHistory = (): Promise<ApiResponse<any>> => {
  return request.get('/points/history')
}

export const updateUserInfo = (data: { nickname?: string; email?: string }): Promise<ApiResponse<any>> => {
  return request.put('/user/info', data)
} 