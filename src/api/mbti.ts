import { get, post, del } from '@/utils/request.ts'
import type { ApiResponse } from '@/types/user.ts'

// MBTI 问题接口
export interface MbtiQuestion {
  id: number
  questionText: string
  dimension: string
  sort: number
  status: number
}

// MBTI 测试结果接口
export interface MbtiResult {
  id: number
  username: string
  mbtiType: string
  eScore: number
  iScore: number
  sScore: number
  nScore: number
  tScore: number
  fScore: number
  jScore: number
  pScore: number
  testTime: string
}

// MBTI 答案类型
export interface MbtiAnswers {
  [key: string]: string
}

/**
 * 获取 MBTI 测试问题列表
 */
export const getMbtiQuestionsService = (): Promise<ApiResponse<MbtiQuestion[]>> => {
  return get<ApiResponse<MbtiQuestion[]>>('/mbti/questions')
}

/**
 * 提交 MBTI 测试答案
 * @param username 用户名
 * @param answers 答案对象，键为问题ID，值为"是"或"否"
 */
export const submitMbtiAnswersService = (
  username: string, 
  answers: MbtiAnswers
): Promise<ApiResponse<MbtiResult>> => {
  return post<ApiResponse<MbtiResult>>(`/mbti/submit?username=${username}`, answers)
}

/**
 * 获取用户的 MBTI 测试记录
 * @param username 用户名
 */
export const getMbtiRecordsService = (
  username: string
): Promise<ApiResponse<MbtiResult[]>> => {
  return get<ApiResponse<MbtiResult[]>>(`/mbti/records/${username}`)
}

/**
 * 删除 MBTI 测试记录
 * @param id 记录ID
 */
export const deleteMbtiRecordService = (
  id: number
): Promise<ApiResponse<void>> => {
  return del<ApiResponse<void>>(`/mbti/records/${id}`)
} 