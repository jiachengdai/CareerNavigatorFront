import { get, post, del } from '@/utils/request.ts'
import type { UserInfo, ApiResponse } from '@/types/user'

// 根据ID获取用户信息
export const getUserByIdService = (id: number): Promise<ApiResponse<UserInfo>> => {
  return get<ApiResponse<UserInfo>>(`/user/${id}`)
}

// 根据用户名获取用户信息
export const getUserByUsernameService = (username: string): Promise<ApiResponse<UserInfo>> => {
  return get<ApiResponse<UserInfo>>(`/user/username/${username}`)
}

// 获取用户列表
export const getUserListService = (): Promise<ApiResponse<UserInfo[]>> => {
  return get<ApiResponse<UserInfo[]>>('/user/list')
}

// 添加用户
export const addUserService = (userData: Omit<UserInfo, 'id'>): Promise<ApiResponse<UserInfo>> => {
  return post<ApiResponse<UserInfo>>('/user/add', userData)
}

// 删除用户
export const deleteUserService = (id: number): Promise<ApiResponse<void>> => {
  return del<ApiResponse<void>>(`/user/${id}`)
}
