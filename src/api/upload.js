import request from '@/utils/request';
export const uploadFileService = (file) => {
    const formData = new FormData();
    formData.append('file', file); // Append the file to the FormData object
   return request.post('/upload',formData)
}