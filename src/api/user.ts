import type { ApiResponse, UserInfo } from '../types'
import request from '../utils/request'

export const checkIn = (): Promise<ApiResponse<any>> => {
  return request.post('/checkin')
}

export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return request.get('/user/info')
}

export const getPointsHistory = (params): Promise<ApiResponse<any>> => {
  return request.get('/points/history', { params })
}

export const updateUserInfo = (data: { nickname?: string; email?: string, avatar?: string }): Promise<ApiResponse<any>> => {
  return request.put('/user/info', data)
}
export const share = (data): Promise<ApiResponse<any>> => {
  return request.post('/share', data)
}
export const addPoints = (data): Promise<ApiResponse<any>> => {
  return request.post('/addPoints', data)
}
export const changePassword = (data): Promise<ApiResponse<any>> => {
  return request.put('/user/password', data)
}