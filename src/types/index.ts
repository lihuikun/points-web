export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export interface UserInfo {
  id: number;
  email: string;
  points: number;
  isCheckedIn: boolean;
  continuousDays: number;
  nickname?: string;
  avatar?: string;
}

export interface CheckInHistory {
  id: number;
  userId: number;
  points: number;
  checkInDate: string;
  continuousDays: number;
} 