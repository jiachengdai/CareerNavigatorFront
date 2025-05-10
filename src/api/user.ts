import { get, post, del, put } from '@/utils/request.ts'
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
export const getUserListService = (params?: { 
  pageNum?: number, 
  pageSize?: number
}): Promise<ApiResponse<{
  total: number;
  list: UserInfo[];
  pageNum: number;
  pageSize: number;
  pages: number;
}>> => {
  return get<ApiResponse<{
    total: number;
    list: UserInfo[];
    pageNum: number;
    pageSize: number;
    pages: number;
  }>>('/user/list', params)
}

// 添加用户
export const addUserService = (userData: Omit<UserInfo, 'id'>): Promise<ApiResponse<UserInfo>> => {
  return post<ApiResponse<UserInfo>>('/user/add', userData)
}

// 更新用户
export const updateUserService = (userData: UserInfo): Promise<ApiResponse<UserInfo>> => {
  return put<ApiResponse<UserInfo>>('/user/update', userData)
}

// 删除用户
export const deleteUserService = (id: number): Promise<ApiResponse<void>> => {
  return del<ApiResponse<void>>(`/user/${id}`)
}
