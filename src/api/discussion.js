import request from '@/utils/request';

/**
 * 发布评论或主题帖
 * @param {Object} discussionData - 评论/主题帖数据
 * @returns {Promise} 返回发布结果
 */
export const publishDiscussionService = (discussionData) => {
  return request.post('/discussions/publish', discussionData);
};

/**
 * 发布与职位关联的评论或主题帖
 * @param {Object} discussionData - 评论/主题帖数据
 * @param {Number} jobId - 职位ID
 * @returns {Promise} 返回发布结果
 */
export const publishJobDiscussionService = (discussionData, jobId) => {
  return request.post(`/discussions/publish/${jobId}`, discussionData);
};

/**
 * 获取评论/主题帖列表
 * @param {Number} parentId - 父评论ID，0表示获取主题帖列表
 * @returns {Promise} 返回评论/主题帖列表
 */
export const getDiscussionsService = (parentId) => {
  return request.get(`/discussions/list/${parentId}`);
};

/**
 * 获取指定职位的评论/主题帖列表
 * @param {Number} jobId - 职位ID
 * @returns {Promise} 返回评论/主题帖列表
 */
export const getJobDiscussionsService = (jobId) => {
  return request.get(`/discussions/job/${jobId}`);
};

/**
 * 删除评论/主题帖
 * @param {Number} id - 评论/主题帖ID
 * @returns {Promise} 返回删除结果
 */
export const deleteDiscussionService = (id) => {
  return request.delete(`/discussions/delete/${id}`);
}; 