<template>
  <div class="login-container" :class="{ dark: settingsStore.isDark }">
    <div class="login-box">
      <div class="logo">
        <h1
          style="
            font-family: '阿里妈妈数黑体';
            color: #1e90ff;
            text-shadow: 2px 2px 4px rgba(30, 144, 255, 0.5);
          "
        >
          CareerNavigator<span style="color: #ff6347">🌟</span>
        </h1>
      </div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="login" tab="登录">
          <a-form :model="loginForm" @finish="handleLogin">
            <a-form-item
              name="username"
              :rules="[{ required: true, message: '请输入用户名' }]"
            >
              <a-input
                v-model:value="loginForm.username"
                placeholder="用户名"
                size="large"
                style="color: #1e90ff; border-color: #1e90ff"
              >
                <template #prefix>
                  <UserOutlined style="color: #1e90ff" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              name="password"
              :rules="[{ required: true, message: '请输入密码' }]"
            >
              <a-input-password
                v-model:value="loginForm.password"
                placeholder="密码"
                size="large"
                style="color: #1e90ff; border-color: #1e90ff"
              >
                <template #prefix>
                  <LockOutlined style="color: #1e90ff" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <a-checkbox v-model:checked="rememberPassword" style="color: #1e90ff">
                记住密码
              </a-checkbox>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="loading"
                style="background-color: #1e90ff; border-color: #1e90ff"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="register" tab="注册">
          <a-form :model="registerForm" @finish="handleRegister">
            <a-form-item
              name="username"
              :rules="[
                { required: true, message: '请输入用户名' },
                { min: 6, message: '用户名至少6个字符' },
              ]"
            >
              <a-input
                v-model:value="registerForm.username"
                placeholder="用户名（至少6个字符）"
                size="large"
                style="color: #1e90ff; border-color: #1e90ff"
              >
                <template #prefix>
                  <UserOutlined style="color: #1e90ff" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              name="password"
              :rules="[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]"
            >
              <a-input-password
                v-model:value="registerForm.password"
                placeholder="密码（至少6个字符）"
                size="large"
                style="color: #1e90ff; border-color: #1e90ff"
              >
                <template #prefix>
                  <LockOutlined style="color: #1e90ff" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item
              name="confirmPassword"
              :rules="[
                { required: true, message: '请确认密码' },
                { validator: validateConfirmPassword },
              ]"
            >
              <a-input-password
                v-model:value="registerForm.confirmPassword"
                placeholder="确认密码"
                size="large"
                style="color: #1e90ff; border-color: #1e90ff"
              >
                <template #prefix>
                  <LockOutlined style="color: #1e90ff" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="loading"
                style="background-color: #1e90ff; border-color: #1e90ff"
              >
                注册
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { useTokenStore } from "@/store/token";
import { useAccountInfoStore } from "@/store/account";
import * as accountApi from "@/api/account";
import { useSettingsStore } from "@/store/useSettingsStore";

const router = useRouter();
const tokenStore = useTokenStore();
const accountStore = useAccountInfoStore();
const settingsStore = useSettingsStore();

const activeKey = ref("login");
const loading = ref(false);
const rememberPassword = ref(false);

// 检查登录状态
const checkLoginStatus = async () => {
  console.log("开始检查登录状态");
  const currentToken = tokenStore.token;
  console.log("当前Token:", currentToken ? "存在" : "不存在");
  if (currentToken) {
    try {
      loading.value = true;

      // 先检查 store 中是否有用户信息
      console.log(
        "检查store中是否有用户信息:",
        accountStore.info?.username ? "存在" : "不存在"
      );
      if (accountStore.info?.username) {
        console.log("store中有用户信息，直接跳转到resume页面");
        await router.push("/resumeDesign");
        return;
      }

      // 如果 store 中没有用户信息，尝试获取当前用户信息
      console.log("store中没有用户信息，尝试获取当前用户信息");
      try {
        const userInfoResult = await accountApi.getCurrentUserInfo();
        console.log("获取当前用户信息结果:", userInfoResult);
        if (userInfoResult.code === 0 && userInfoResult.data) {
          console.log("成功获取到用户信息:", userInfoResult.data);
          accountStore.setInfo(userInfoResult.data);
          await router.push("/resumeDesign");
        } else {
          // 如果获取用户信息失败，清除token和用户信息
          console.log("获取用户信息失败，服务端响应:", userInfoResult);
          tokenStore.removeToken();
          accountStore.removeInfo();
        }
      } catch (error: any) {
        console.error("获取用户信息失败:", error);
        if (error.response) {
          console.error("响应状态码:", error.response.status);
          console.error("响应数据:", error.response.data);
        }
        tokenStore.removeToken();
        accountStore.removeInfo();
      }
    } finally {
      loading.value = false;
    }
  } else {
    console.log("没有token，需要登录");
  }
};

// 组件挂载时检查登录状态和读取保存的账号密码
onMounted(() => {
  console.log("Login组件已挂载，准备检查登录状态");
  checkLoginStatus();
  loadSavedCredentials();
});

// 读取保存的账号密码
const loadSavedCredentials = () => {
  try {
    // 读取保存的用户名
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      loginForm.username = savedUsername;
    }

    // 读取保存的密码状态
    const savedRememberFlag = localStorage.getItem("rememberPassword");
    if (savedRememberFlag === "true") {
      rememberPassword.value = true;

      // 如果选择了记住密码，读取加密保存的密码
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedPassword) {
        try {
          // 这里使用简单的Base64解码，实际项目中应当使用更安全的加密方式
          loginForm.password = window.atob(savedPassword);
        } catch (e) {
          console.error("密码解析错误:", e);
          // 出错时清除保存的密码
          localStorage.removeItem("rememberedPassword");
        }
      }
    }
  } catch (e) {
    console.error("读取保存的凭证出错:", e);
  }
};

// 保存账号密码
const saveCredentials = () => {
  try {
    // 始终保存用户名
    localStorage.setItem("rememberedUsername", loginForm.username);

    // 保存是否记住密码的选项
    localStorage.setItem("rememberPassword", rememberPassword.value.toString());

    // 如果选择了记住密码，则保存加密后的密码
    if (rememberPassword.value) {
      // 这里使用简单的Base64编码，实际项目中应当使用更安全的加密方式
      localStorage.setItem("rememberedPassword", window.btoa(loginForm.password));
    } else {
      // 如果未选择记住密码，删除已保存的密码
      localStorage.removeItem("rememberedPassword");
    }
  } catch (e) {
    console.error("保存凭证出错:", e);
  }
};

// 登录表单
const loginForm = reactive({
  username: "",
  password: "",
});

// 注册表单
const registerForm = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  type: 0, // 默认普通用户
});

// 处理登录
const handleLogin = async () => {
  console.log("开始登录流程，登录表单数据:", loginForm);
  try {
    loading.value = true;

    console.log("调用登录API");
    const result = await accountApi.accountLoginService(loginForm);
    console.log("登录API返回结果:", result);

    if (result.code === 0) {
      console.log("登录成功，设置token:", result.data);
      message.success("登录成功");
      tokenStore.setToken(result.data);

      // 保存账号密码
      saveCredentials();

      console.log("开始获取用户信息");
      try {
        const userInfoResult = await accountApi.accountInfoService(loginForm.username);
        console.log("获取用户信息结果:", userInfoResult);
        if (userInfoResult.code === 0 && userInfoResult.data) {
          accountStore.setInfo(userInfoResult.data);
          console.log("跳转到resume页面");
          await router.push("/resumeDesign");
        } else {
          console.error("获取用户信息失败，服务端响应:", userInfoResult);
          message.error(userInfoResult.message || "获取用户信息失败");
        }
      } catch (infoError: any) {
        console.error("获取用户信息出错:", infoError);
        if (
          infoError.response &&
          infoError.response.data &&
          infoError.response.data.message
        ) {
          message.error(infoError.response.data.message);
        } else {
          message.error("获取用户信息失败");
        }
      }
    } else {
      console.log("登录失败:", result.message);
      message.error(result.message || "登录失败");
    }
  } catch (error: any) {
    console.error("登录过程中发生错误:", error);
    // 优先显示API返回的具体错误信息
    if (error.message) {
      console.log("API返回的错误信息:", error.message);
      message.error(error.message);
      return;
    }
    message.error("登录过程中发生错误");
  } finally {
    loading.value = false;
  }
};

// 处理注册
const handleRegister = async () => {
  console.log("开始注册流程，注册表单数据:", registerForm);

  // 验证两次输入的密码是否一致
  if (registerForm.password !== registerForm.confirmPassword) {
    message.error("两次输入的密码不一致");
    return;
  }

  try {
    loading.value = true;

    console.log("调用注册API");
    const result = await accountApi.accountRegisterService(registerForm);
    console.log("注册API返回结果:", result);

    if (result.code === 0) {
      console.log("注册成功，切换到登录页");
      message.success("注册成功，请登录");
      activeKey.value = "login";
      loginForm.username = registerForm.username;
      loginForm.password = "";
    } else {
      console.log("注册失败:", result.message);
      message.error(result.message || "注册失败");
    }
  } catch (error: any) {
    console.error("注册过程中发生错误:", error);
    // 优先显示API返回的具体错误信息
    if (error.response && error.response.data) {
      const responseData = error.response.data;
      if (responseData.message) {
        message.error(responseData.message);
        return;
      }
    }
    message.error("注册过程中发生错误");
  } finally {
    loading.value = false;
  }
};

// 验证确认密码
const validateConfirmPassword = (rule: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error("请确认密码"));
  }
  if (value !== registerForm.password) {
    return Promise.reject(new Error("两次输入的密码不一致"));
  }
  return Promise.resolve();
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* background: linear-gradient(135deg, rgba(45, 103, 234, 0.1) 0%, #2d67ea 100%); */
  background-image: url("/src/assets/imgs/background.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.login-container.dark {
  background: linear-gradient(135deg, #1a1b26 0%, #1e293b 100%);
}

.login-box {
  width: 380px;
  background: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(45, 103, 234, 0.1);
  padding: 30px;
}

.dark .login-box {
  background: #1e1e2e;
  color: #cdd6f4;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo h1 {
  color: #333;
  font-size: 28px;
  margin: 0;
}

.dark .logo h1 {
  color: #cdd6f4;
}

/* 暗黑模式下的表单样式 */
.dark :deep(.ant-input),
.dark :deep(.ant-input-password .ant-input) {
  background-color: #2c2e3b;
  border-color: #3b4a6b;
  color: #fff;
  caret-color: #fff;
}

.dark :deep(.ant-input-affix-wrapper),
.dark :deep(.ant-input-password) {
  background-color: #2c2e3b;
  border-color: #3b4a6b;
}

.dark :deep(.ant-input-affix-wrapper:focus),
.dark :deep(.ant-input-affix-wrapper-focused),
.dark :deep(.ant-input:focus),
.dark :deep(.ant-input-focused) {
  border-color: #87aafe;
  box-shadow: 0 0 0 2px rgba(135, 170, 254, 0.2);
}

.dark :deep(.ant-input-prefix) {
  color: #87aafe;
}

.dark :deep(.ant-input-password-icon) {
  color: #87aafe;
}

.dark :deep(.ant-checkbox-wrapper) {
  color: #cdd6f4;
}

.dark :deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #87aafe;
  border-color: #87aafe;
}

.dark :deep(.ant-tabs-tab) {
  color: #a6adc8;
}

.dark :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #87aafe;
}

.dark :deep(.ant-tabs-ink-bar) {
  background: #87aafe;
}

.dark :deep(.ant-btn-primary) {
  background-color: #87aafe;
  border-color: #87aafe;
}

.dark :deep(.ant-btn-primary:hover) {
  background-color: #a4c4fe;
  border-color: #a4c4fe;
}
</style>
