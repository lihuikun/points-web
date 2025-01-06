import type { ApiResponse } from '../types';
import request from '../utils/request'

export interface LotteryResult {
    prizeIndex: number;
    prizeName: string;
    cost: number;
    remainingPoints: number;
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