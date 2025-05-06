import request from '@/utils/request.js';

// 用户登录
export const accountLoginService = loginData => {
  const params = new URLSearchParams();
  for (let key in loginData) {
    params.append(key, loginData[key]);
  }
  return request.post('/account/login', params);
};

// 获取用户信息
export const accountInfoService = username => {
  return request.get('/account/info?username=' + username);
};

// 用户注册
export const accountRegisterService = registerData => {
  const params = new URLSearchParams();
  for (let key in registerData) {
    params.append(key, registerData[key]);
  }
  return request.post('/account/register', params);
};

// 上传用户头像
export const uploadUserAvatarService = imgUrl => {
  const params = new URLSearchParams();
  params.append('imgUrl', imgUrl);

  return request.put('/account/avatar', params);
};

// 修改密码
export const changePasswordService = changeData => {
  const params = new URLSearchParams();
  for (let key in changeData) {
    params.append(key, changeData[key]);
  }
  return request.post('/account/changepassword', params);
};

// 修改用户名
export const updateUsernameService = updateData => {
  const params = new URLSearchParams();
  for (let key in updateData) {
    params.append(key, updateData[key]);
  }
  return request.post('/account/updateUsername', params);
};

// 退出登录
export const accountLogoutService = () => {
  return request.post('/account/logout');
};
