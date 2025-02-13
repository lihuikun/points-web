// src/gift.ts
import type { ApiResponse } from '../types';
import request from '../utils/request';
export interface Gift {
  id: number;
  name: string;
  points: number;
  stock: number;
  createdAt: Date;
  userId?: number;
}

export interface GiftResponse {
  id: number;
  name: string;
  points: number;
  stock: number;
  createdAt: string; // 日期格式化为字符串
  pointsUsed?: number;
}

// 获取所有礼品
export const getAllGifts = (): Promise<ApiResponse<GiftResponse[]>> => {
  return request.get('/gifts');
};

// 获取单个礼品
export const getGiftById = (id: number): Promise<ApiResponse<GiftResponse>> => {
  return request.get(`/gifts/${id}`);
};

// 创建新礼品
export const createGift = (data: Omit<Gift, 'id' | 'createdAt'>): Promise<ApiResponse<GiftResponse>> => {
  return request.post('/gifts', data);
};

// 更新礼品信息
export const updateGift = (id: number, data: Partial<Omit<Gift, 'id' | 'createdAt'>>): Promise<ApiResponse<GiftResponse>> => {
  return request.put(`/gifts/${id}`, data);
};

// 删除礼品
export const deleteGift = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/gifts/${id}`);
};

// 兑换礼品
export const redeemGift = (id: number, data: Pick<Gift, 'userId'>): Promise<ApiResponse<GiftResponse>> => {
  return request.post(`/gifts/redeem/${id}`, data);
}

// 获取兑换记录
export const getGiftRecords = (userId, params: { page: number, pageSize: number }): Promise<ApiResponse<{ total: number, rows: GiftResponse[] }>> => {
  return request.get(`/gifts/redeem/records/${userId}`, { params });
};