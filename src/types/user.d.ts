// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  nickname: string
  sex: string
  age: number
  education: string
  major: string
  tel: string
  email: string
  expectedjob: string
  graduationtime: string
  registertime: string
}

// API响应接口
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
} 