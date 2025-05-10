import request from '@/utils/request';

/**
 * 创建简历的API
 * @param {Object} resumeData - 简历数据，包含title、content、type等字段
 * @returns {Promise} 返回创建结果
 */
export const createResumeService = (resumeData) => {
  return request.post('/resume/create', resumeData)
}

/**
 * 高级简历评估API
 * @param {String} resumeContent - 简历内容
 * @returns {Promise} 返回评估结果
 */
export const assessResumeService = (resumeContent) => {
  return request.post('/resume/advanced-assess', resumeContent)
}

/**
 * 根据ID获取简历API
 * @param {Number} id - 简历ID
 * @returns {Promise} 返回简历详情
 */
export const getResumeByIdService = (id) => {
  return request.get(`/resume/${id}`)
}

/**
 * 更新简历API
 * @param {Object} resumeData - 简历数据
 * @returns {Promise} 返回更新结果
 */
export const updateResumeService = (resumeData) => {
  return request.put('/resume/update', resumeData)
}

/**
 * 删除简历API
 * @param {Number} id - 简历ID
 * @returns {Promise} 返回删除结果
 */
export const deleteResumeService = (id) => {
  return request.delete(`/resume/${id}`)
}

/**
 * 根据用户名获取简历列表API
 * @param {String} username - 用户名
 * @returns {Promise} 返回简历列表
 */
export const getResumeListByUserService = (username) => {
  return request.get(`/resume/list/${username}`)
} 