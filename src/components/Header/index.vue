<template>
  <header class="navbar">
    <nav>
      <ul>
        <li><router-link to="/">
            <SvgIcon iconName="resume" />
            简历制作
          </router-link></li>
        <li ref="templateStore"><router-link to="/template">
            <SvgIcon iconName="templateStore" />
            模板市场
          </router-link></li>
        <li ref="setting"><router-link to="/aiDeep">
            <SvgIcon iconName="ai" />
            AI深度交流
          </router-link></li>
        <li ref="setting"><router-link to="/setting">
            <SvgIcon iconName="setting" />
            网站配置
          </router-link></li>

        <li><router-link to="/resumeDesign">简历模板设计</router-link></li>
      </ul>
    </nav>
    
    <!-- 用户头像和下拉菜单 -->
    <div class="user-avatar-container">
      <a-dropdown placement="bottomRight">
        <div class="user-info">
          <span class="username">{{ userInfo?.username || '用户' }}</span>
          <a-avatar :src="userInfo?.avatar || defaultAvatar" :size="36" />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="username">
              <a @click="handleUpdateUsername">
                <UserOutlined /> 修改用户名
              </a>
            </a-menu-item>
            <a-menu-item key="password">
              <a @click="handleChangePassword">
                <LockOutlined /> 修改密码
              </a>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout">
              <a @click="handleLogout">
                <LogoutOutlined /> 退出登录
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </header>

  <!-- 漫游式引导 -->
  <a-tour v-model:open="tourOpen" :steps="tourSteps" :mask="true" :next-button-props="{ children: '下一步' }"
    :prev-button-props="{ children: '上一步' }" :finish-button-props="{ children: '完成' }" @finish="handleFinish"
    @close="handleFinish" />
    
  <!-- 修改用户名对话框 -->
  <a-modal v-model:visible="usernameModalVisible" title="修改用户名" @ok="submitUsername" :confirmLoading="modalLoading"
    okText="确认" cancelText="取消" :width="420">
    <a-form :model="usernameForm" layout="vertical">
      <a-form-item label="新用户名" name="username" :rules="[{ required: true, message: '请输入新用户名' }]">
        <a-input v-model:value="usernameForm.username" placeholder="请输入新用户名" size="large" />
      </a-form-item>
      <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码验证身份' }]">
        <a-input-password v-model:value="usernameForm.password" placeholder="请输入密码验证身份" size="large" />
      </a-form-item>
    </a-form>
  </a-modal>
  
  <!-- 修改密码对话框 -->
  <a-modal v-model:visible="passwordModalVisible" title="修改密码" @ok="submitPassword" :confirmLoading="modalLoading"
    okText="确认" cancelText="取消" :width="420">
    <a-form :model="passwordForm" layout="vertical">
      <a-form-item label="原密码" name="oldPassword" 
        :rules="[{ required: true, message: '请输入原密码' }]">
        <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入原密码" size="large" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword" 
        :rules="[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少6个字符' }]">
        <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" size="large" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import SvgIcon from '../SvgIcon.vue';
import { useResumeStore } from "../../store/useResumeStore";
import { useAccountInfoStore } from "@/store/account";
import { useTokenStore } from "@/store/token";
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { changePasswordService, updateUsernameService, accountLogoutService } from '@/api/account';
import type { TourProps } from 'ant-design-vue';

const store = useResumeStore();
const accountStore = useAccountInfoStore();
const tokenStore = useTokenStore();
const router = useRouter();
const setting = ref(null);
const templateStore = ref(null);
const tourOpen = ref(false); // 控制引导是否打开

// 默认头像
const defaultAvatar = 'https://api.dicebear.com/7.x/micah/svg?seed=user';

// 获取用户信息
const userInfo = computed(() => accountStore.info);

// 修改用户名相关状态
const usernameModalVisible = ref(false);
const usernameForm = reactive({
  username: '',
  password: ''
});

// 修改密码相关状态
const passwordModalVisible = ref(false);
const passwordForm = reactive({
  oldPassword: '',
  newPassword: ''
});

const modalLoading = ref(false);

// 打开修改用户名对话框
const handleUpdateUsername = () => {
  usernameForm.username = userInfo.value?.username || '';
  usernameForm.password = '';
  usernameModalVisible.value = true;
};

// 提交修改用户名
const submitUsername = async () => {
  if (!usernameForm.username || !usernameForm.password) {
    message.error('请填写完整信息');
    return;
  }
  
  modalLoading.value = true;
  
  try {
    const result = await updateUsernameService({
      oldUsername: userInfo.value?.username || '',
      newUsername: usernameForm.username,
      password: usernameForm.password
    });
    
    if (result.code === 0) {
      message.success('用户名修改成功');
      // 更新用户信息
      if (accountStore.info) {
        accountStore.setInfo({
          ...accountStore.info,
          username: usernameForm.username
        });
      }
      usernameModalVisible.value = false;
    } else {
      message.error(result.message || '修改失败');
    }
  } catch (error) {
    console.error('修改用户名错误:', error);
    message.error('修改用户名时发生错误');
  } finally {
    modalLoading.value = false;
  }
};

// 打开修改密码对话框
const handleChangePassword = () => {
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordModalVisible.value = true;
};

// 提交修改密码
const submitPassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword) {
    message.error('请填写完整信息');
    return;
  }
  
  modalLoading.value = true;
  
  try {
    const result = await changePasswordService({
      username: userInfo.value?.username || '',
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });
    
    if (result.code === 0) {
      message.success('密码修改成功，请重新登录');
      // 退出登录
      tokenStore.removeToken();
      accountStore.removeInfo();
      passwordModalVisible.value = false;
      router.push('/login');
    } else {
      message.error(result.message || '修改失败');
    }
  } catch (error) {
    console.error('修改密码错误:', error);
    message.error('修改密码时发生错误');
  } finally {
    modalLoading.value = false;
  }
};

// 处理退出登录
const handleLogout = async () => {
  try {
    await accountLogoutService();
    // 无论后端结果如何，前端都清除登录状态
    tokenStore.removeToken();
    accountStore.removeInfo();
    message.success('已退出登录');
    router.push('/login');
  } catch (error) {
    console.error('退出登录错误:', error);
    // 即使API调用出错，也清除前端登录状态
    tokenStore.removeToken();
    accountStore.removeInfo();
    router.push('/login');
  }
};

const tourSteps: TourProps['steps'] = [
  {
    title: "网站配置",
    description: "请先进入网站配置，完善基本信息（否则无法使用大模型润色！）",
    target: () => setting.value,
  },
  {
    title: "选择模板",
    description: "然后进入模板市场，挑选适合你的简历模板。",
    target: () => templateStore.value,
  }
];

// 引导完成时的回调
const handleFinish = () => {
  tourOpen.value = false;
};

onMounted(() => {
  if (store.isFirstVisit) {
    tourOpen.value = true; // 开始引导
  }
});
</script>

<style scoped>
.navbar {
  background: linear-gradient(to right, var(--color-5), var(--color-6), var(--color-5));
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.navbar nav {
  flex: 1;
}

.navbar nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbar nav ul li {
  float: left;
}

.navbar nav ul li a {
  display: block;
  color: white;
  text-align: center;
  font-size: 17px;
  padding: 17px 16px;
  text-decoration: none;
  transition: all 0.22s;
}

.navbar nav ul li a:hover {
  background-color: #ffffff;
  color: black;
}

.user-avatar-container {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 18px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username {
  margin-right: 10px;
  color: white;
  font-weight: 500;
}
</style>
