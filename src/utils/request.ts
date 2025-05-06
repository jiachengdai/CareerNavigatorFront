import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
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
    // 这里可以根据后端的响应结构进行统一处理
    return res
  },
  (error) => {
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