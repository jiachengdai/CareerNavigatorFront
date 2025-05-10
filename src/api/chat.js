import request from '@/utils/request'
export const recordChat = (msg, interviewid, role) => {
    return request.post('/chat/record', {
        msg,
        interviewid,
        role
    });
}