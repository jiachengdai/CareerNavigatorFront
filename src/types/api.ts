// API 响应类型
export interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
}

// 用户信息类型
export interface UserInfo {
    username: string
    nickname?: string
    type: number
    [key: string]: any
}

// 登录数据类型
export interface LoginData {
    username: string
    password: string
    [key: string]: string
}

// 注册数据类型
export interface RegisterData {
    username: string
    password: string
    type: number
    [key: string]: string | number
}

// 修改密码数据类型
export interface ChangePasswordData {
    username: string
    oldPassword: string
    newPassword: string
    [key: string]: string
}

// 修改用户名数据类型
export interface UpdateUsernameData {
    oldUsername: string
    newUsername: string
    password: string
    [key: string]: string
} 