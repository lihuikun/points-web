import type { ApiResponse } from '../types';
import request from '../utils/request'

export interface LotteryResult {
  name: string;
  value: number;//中奖的积分
  points: number;//剩余积分
}

export interface LotteryConfig {
  prizes: Array<{
    name: string;
    probability: number;
    color: string;
  }>;
  cost: number;
}

export const startLottery = (): Promise<ApiResponse<any>> => {
  return request.post('/lottery/draw')
}

export const getLotteryConfig = (): Promise<ApiResponse<any>> => {
  return request.get('/lottery/config')
}

export const drawLottery = (data: { userId: string }): Promise<ApiResponse<LotteryResult>> => {
  return request.post('/user/draw', data)
}
export const getLotteryHistory = (params): Promise<ApiResponse<any>> => {
  return request.get('/user/draw/history', { params })
}