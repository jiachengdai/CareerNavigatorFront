import request from '@/utils/request';
import { id } from 'element-plus/es/locale/index.mjs';
export const newInterviewService = (interview) => {
    return request.post('/interview/new', interview)
}
export const getAllInterviewService = () => {
    return request.get('/interview/getAll')
}
export const deleteInterviewService=(id)=>{
    return request.delete('/interview/delete?id='+id)
}
export const getInterviewDetailService=(id)=>{
    return request.get('/interview/detail?id='+id)
}
export const extractResumeService=(file)=>{
      const formData = new FormData();
      formData.append('file', file); // Append the file to the FormData object
     return request.post('/interview/extractText',formData)
}
export const getInterviewChatService=(id)=>{
    return request.get('/interview/getInterviewChat?interviewid='+id)
}
export const getInterviewAssignmentService=(id)=>{
    return request.get('/interview/getInterviewAssignment?interviewid='+id)
}