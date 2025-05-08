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
 * 获取评论/主题帖列表
 * @param {Number} parentId - 父评论ID，0表示获取主题帖列表
 * @returns {Promise} 返回评论/主题帖列表
 */
export const getDiscussionsService = (parentId) => {
  return request.get(`/discussions/list/${parentId}`);
};

/**
 * 删除评论/主题帖
 * @param {Number} id - 评论/主题帖ID
 * @returns {Promise} 返回删除结果
 */
export const deleteDiscussionService = (id) => {
  return request.delete(`/discussions/delete/${id}`);
}; 