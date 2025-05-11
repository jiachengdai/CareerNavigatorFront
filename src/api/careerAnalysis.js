import requst from '@/utils/request'
export const generatePlanService = (job,description) => {
  return requst.get('/ai/career/analysis?targetJob='+job+'&description='+description);
}