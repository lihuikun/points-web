import request from '../utils/request'

export const checkIn = () => {
  return request.post('/checkin')
}

export const getUserInfo = () => {
  return request.get('/user/info')
}

export const getPointsHistory = () => {
  return request.get('/points/history')
}

export const updateUserInfo = (data: { nickname?: string; email?: string }) => {
  return request.put('/user/info', data)
} 