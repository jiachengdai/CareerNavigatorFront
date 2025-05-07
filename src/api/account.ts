import { get, post, put } from '@/utils/request.ts'
import type {
    ApiResponse,
    LoginData,
    RegisterData,
    UserInfo,
    ChangePasswordData,
    UpdateUsernameData
} from '@/types/api'

export type { ApiResponse, UserInfo }

export const accountLoginService = (loginData: LoginData): Promise<ApiResponse<string>> => {
    const params = new URLSearchParams()
    for (let key in loginData) {
        params.append(key, String(loginData[key]))
    }
    return post('/account/login', params)
}

// 获取当前登录用户信息
export const getCurrentUserInfo = (): Promise<ApiResponse<UserInfo>> => {
    return get('/account/current')
}

export const accountInfoService = (username: string): Promise<ApiResponse<UserInfo>> => {
    return get('/account/info', { username })
}

export const accountRegisterService = (registerData: RegisterData): Promise<ApiResponse> => {
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, String(registerData[key]))
    }
    return post('/account/register', params)
}


export const uploadUserAvatarService = (imgUrl: string): Promise<ApiResponse> => {
    const params = new URLSearchParams()
    params.append('imgUrl', imgUrl)
    return put('/account/avatar', params)
}

// 修改密码
export const changePasswordService = (changeData: ChangePasswordData): Promise<ApiResponse> => {
    const params = new URLSearchParams()
    for (let key in changeData) {
        params.append(key, changeData[key])
    }
    return post('/account/changepassword', params)
}

// 修改用户名
export const updateUsernameService = (updateData: UpdateUsernameData): Promise<ApiResponse> => {
    const params = new URLSearchParams()
    for (let key in updateData) {
        params.append(key, updateData[key])
    }
    return post('/account/updateUsername', params)
}

// 退出登录
export const accountLogoutService = (): Promise<ApiResponse> => {
    return post('/account/logout')
} 