import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useTokenStore } from '@/store/token'

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从TokenStore获取token
    const tokenStore = useTokenStore()
    if (tokenStore.token) {
      config.headers.Authorization = tokenStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 判断业务状态码
    if (res.code === 0) {
      return res
    }
    return Promise.reject(res)
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 未授权处理
      console.error('未授权，请重新登录')
      const tokenStore = useTokenStore()
      tokenStore.removeToken()
      // 这里不直接使用router跳转，避免循环依赖
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 封装GET请求
export const get = <T>(url: string, params?: any): Promise<T> => {
  return service.get(url, { params })
}

// 封装POST请求
export const post = <T>(url: string, data?: any): Promise<T> => {
  return service.post(url, data)
}

// 封装PUT请求
export const put = <T>(url: string, data?: any): Promise<T> => {
  return service.put(url, data)
}

// 封装DELETE请求
export const del = <T>(url: string): Promise<T> => {
  return service.delete(url)
}

export default {
  get,
  post,
  put,
  delete: del
} 