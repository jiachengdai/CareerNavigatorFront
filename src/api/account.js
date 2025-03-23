import request from '@/utils/request.js'
export const accountLoginService=(loginData)=>{
    const params= new URLSearchParams();
    for(let key in loginData){
     params.append(key,loginData[key])
    }
    return request.post('/account/login',params)
     
 }
 export const accountInfoService=(username)=>{
   return  request.get('/account/info?username='+username);
 }
export const accountRegisterService=(registerData)=>{
  const params= new URLSearchParams();
  for(let key in registerData){
   params.append(key,registerData[key])
  }
  return request.post('/account/register',params)
}
 
 export const uploadUserAvatarService=(imgUrl)=>{
  const params= new URLSearchParams();
  params.append('imgUrl', imgUrl);  

  return request.put('/account/avatar',params)
 }