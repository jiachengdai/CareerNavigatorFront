import request from '@/utils/request';

/**
 * 创建简历的API
 * @param {Object} resumeData - 简历数据，包含title、content、type等字段
 * @returns {Promise} 返回创建结果
 */
export const createResumeService = (resumeData) => {
  return request.post('/resume/create', resumeData)
} 