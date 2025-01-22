import type { ApiResponse } from '../types';
import request from '../utils/request'

export interface Weather {
  id: number;
  cityCode: string;
  date: string;
  city: string;
  temperature: string;
  weather: string;
  imageUrl: string;
  description: string;
}
export const getWeather = (params): Promise<ApiResponse<Weather>> => {
  return request.get('/weather', { params })
}