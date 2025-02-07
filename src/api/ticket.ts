import type { ApiResponse, UserInfo } from '../types'
import request from '../utils/request'
// 兑换彩票
export const exchange = (data): Promise<ApiResponse<any>> => {
  return request.post('/lottery/exchange', data)
}
// 获取彩票列表
export const getTickets = (): Promise<ApiResponse<any>> => {
  return request.get('/lottery/tickets')
}
// 手动刷新20张彩票
export const regenerate = (data): Promise<ApiResponse<any>> => {
  return request.post('/lottery/regenerate', data)
}