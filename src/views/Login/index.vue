 
<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="LoginUserInfoForm.username" @blur="checkUsername(LoginUserInfoForm.username)" required />
                <span class="error-tip">{{ loginUsernameTip }}</span>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="LoginUserInfoForm.password" @blur="checkPassword(LoginUserInfoForm.password)" required />
                <span class="error-tip">{{ loginPasswordTip }}</span>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { reactive } from "vue";
import { useTokenStore } from "@/store/token.js";
import { useRouter } from "vue-router";
import { useAccountInfoStore } from "@/store/account";
import { accountInfoService, accountLoginService } from "@/api/account"; 
const router = useRouter();
const tokenStore = useTokenStore(); 
const loginUsernameTip = ref(" ");
const loginPasswordTip = ref(" ");
const accountStore = useAccountInfoStore();

const LoginUserInfoForm = reactive({
  username: "",
  password: "",
});
const RegisterUserInfoForm = reactive({
  username: "",
  password: "",
});
const register = async () => {
  try {
    let result = await userRegisterService(RegisterUserInfoForm);

    ElMessage.success(result.msg ? result.msg : "注册成功");
    loginVisible.value = true;
  } catch (e) {
    ElMessage.error(e);
  }
};
const login = async () => {
  let result = await accountLoginService(LoginUserInfoForm);

  ElMessage.success(result.msg ? result.msg : "登陆成功");
  tokenStore.setToken(result.data);

  let result1 = await accountInfoService(LoginUserInfoForm.username);
  accountStore.setInfo(result1.data);
  console.log(result1.data);
  router.push("/trade/dash");
};
const checkUsername = (username) => {
  if (username.length < 6) {
    loginUsernameTip.value = "用户名长度不能小于6位";
  } else {
    loginUsernameTip.value = "";
  }
};
const checkPassword = (password) => {
  if (password.length < 6) {
    loginPasswordTip.value = "密码长度不能小于6位";
  } else {
    loginPasswordTip.value = "";
  }
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
 
 