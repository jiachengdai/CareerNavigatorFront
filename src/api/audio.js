import request from '@/utils/request'
export const  getAudio=(text) =>{
    return request.get("/audio/tts?text="+text);
}