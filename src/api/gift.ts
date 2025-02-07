// src/gift.ts
import type { ApiResponse } from '../types';
import request from '../utils/request';
export interface Gift {
  id: number;
  name: string;
  points: number;
  stock: number;
  createdAt: Date;
}

export interface GiftResponse {
  id: number;
  name: string;
  points: number;
  stock: number;
  createdAt: string; // 日期格式化为字符串
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