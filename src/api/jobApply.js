import request from '@/utils/request';

/**
 * 获取用户投递记录
 * @param {String} username - 用户名
 * @returns {Promise} 返回用户的投递记录列表
 */
export const getApplyRecordsByUserService = (username) => {
  return request.get(`/job-applies/user/${username}`);
};

/**
 * 创建职位投递记录
 * @param {Object} jobApplyData - 投递记录数据
 * @returns {Promise} 返回创建的投递记录
 */
export const createJobApplyService = (jobApplyData) => {
  return request.post('/job-applies/create', jobApplyData);
};

/**
 * 更新投递记录状态
 * @param {Object} jobApplyData - 包含ID和更新字段的投递记录数据
 * @returns {Promise} 返回更新后的投递记录
 */
export const updateJobApplyService = (jobApplyData) => {
  return request.put('/job-applies/update', jobApplyData);
};

/**
 * 删除投递记录
 * @param {Number} id - 投递记录ID
 * @returns {Promise} 返回删除结果
 */
export const deleteJobApplyService = (id) => {
  return request.delete(`/job-applies/${id}`);
};

/**
 * 根据ID获取投递记录
 * @param {Number} id - 投递记录ID
 * @returns {Promise} 返回指定ID的投递记录
 */
export const getJobApplyByIdService = (id) => {
  return request.get(`/job-applies/${id}`);
}; 