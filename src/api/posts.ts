import type { ApiResponse, UserInfo } from '../types'
import request from '../utils/request'
export interface Post {
  rows: any[],
  total: number
}
export const deletePosts = (params): Promise<ApiResponse<any>> => {
  return request.get('/posts/delete', { params })
}

export const getPosts = (params): Promise<ApiResponse<Post>> => {
  return request.get('/posts', { params })
}

export const addPost = (data): Promise<ApiResponse<any>> => {
  return request.post('/posts', data)
}
export const addPic = (data): Promise<ApiResponse<any>> => {
  return request.post('/gitee/upload', data)
}
export const addComment = (data): Promise<ApiResponse<any>> => {
  return request.post('/posts/comment', data)
}

export const likePosts = (data): Promise<ApiResponse<any>> => {
  return request.post('/posts/like', data)
}