import request from '@/utils/request';

/**
 * 获取简历的评估记录列表
 * @param {Number} resumeId - 简历ID
 * @returns {Promise} 返回评估记录列表
 */
export const getResumeAssessmentRecordsService = (resumeId) => {
  return request.get(`/resume-assessment/list/${resumeId}`);
}

/**
 * 删除评估记录
 * @param {Number} id - 评估记录ID
 * @returns {Promise} 返回删除结果
 */
export const deleteResumeAssessmentRecordService = (id) => {
  return request.delete(`/resume-assessment/delete/${id}`);
} 
export const getAssessmentService=(id)=>{
  return request.post('/analysis-report/generate?resumeId='+id);
}