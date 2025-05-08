import request from '@/utils/request';
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