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

export const startLottery = () => {
    return request.post<{ data: LotteryResult }>('/lottery/draw')
}

export const getLotteryConfig = () => {
    return request.get<{ data: LotteryConfig }>('/lottery/config')
} 