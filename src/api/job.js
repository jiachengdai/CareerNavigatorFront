import request from '@/utils/request';

/**
 * 获取所有岗位信息
 * @returns {Promise} 返回所有岗位列表
 */
export const getAllJobsService = () => {
  return request.get('/jobs')
}

/**
 * 根据ID获取单个岗位信息
 * @param {Number} id - 岗位ID
 * @returns {Promise} 返回单个岗位信息
 */
export const getJobByIdService = (id) => {
  return request.get(`/jobs/${id}`)
}

/**
 * 职位解读接口（调用AI生成结构化解读）
 * @param {Number} jobId - 岗位ID
 * @returns {Promise} 返回岗位解读分析结果
 */
export const analyzeJobService = (jobId) => {
  return request.get(`/jobs/analyze/${jobId}`)
}

/**
 * 职位匹配接口（根据用户需求智能推荐）
 * @param {String} userSkills - 用户掌握的技能（逗号分隔）
 * @param {Number} expectedSalary - 期望薪资（单位：元）
 * @param {String} location - 期望工作地点
 * @returns {Promise} 返回匹配的岗位列表
 */
export const matchJobsService = (userSkills, expectedSalary, location) => {
  const params = new URLSearchParams();
  params.append('userSkills', userSkills);
  params.append('expectedSalary', expectedSalary);
  params.append('location', location);
  
  return request.post('/jobs/match', params)
}