<template>
  <div class="profile-container">
    <a-card title="个人信息" :bordered="false" class="profile-card">
      <template #extra>
        <a-button type="primary" @click="isEditing ? handleSave() : startEdit()" :loading="loading">
          {{ isEditing ? '保存' : (hasProfile ? '编辑' : '创建') }}
        </a-button>
        <a-button v-if="isEditing" class="ml-2" @click="cancelEdit()">取消</a-button>
      </template>

      <div v-if="loading" class="loading-container">
        <a-spin tip="加载中..."></a-spin>
      </div>
      
      <template v-else>
        <!-- 表单模式 -->
        <a-form v-if="isEditing" :model="profileForm" layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="用户名" name="username">
                <a-input v-model:value="profileForm.username" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="昵称" name="nickname" :rules="[{ required: true, message: '请输入昵称' }]">
                <a-input v-model:value="profileForm.nickname" placeholder="请输入昵称" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="性别" name="sex">
                <a-select v-model:value="profileForm.sex" placeholder="请选择性别">
                  <a-select-option value="男">男</a-select-option>
                  <a-select-option value="女">女</a-select-option>
                  <a-select-option value="保密">保密</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="年龄" name="age">
                <a-input-number v-model:value="profileForm.age" :min="1" :max="100" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="学历" name="education">
                <a-select v-model:value="profileForm.education" placeholder="请选择学历">
                  <a-select-option value="高中">高中</a-select-option>
                  <a-select-option value="专科">专科</a-select-option>
                  <a-select-option value="本科">本科</a-select-option>
                  <a-select-option value="硕士">硕士</a-select-option>
                  <a-select-option value="博士">博士</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="专业" name="major">
                <a-input v-model:value="profileForm.major" placeholder="请输入专业" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="联系电话" name="tel">
                <a-input v-model:value="profileForm.tel" placeholder="请输入联系电话" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="电子邮箱" name="email">
                <a-input v-model:value="profileForm.email" placeholder="请输入电子邮箱" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="期望工作" name="expectedjob">
                <a-input v-model:value="profileForm.expectedjob" placeholder="请输入期望工作" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="毕业时间" name="graduationtime">
                <a-date-picker v-model:value="profileForm.graduationtime" 
                  format="YYYY-MM-DD" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        
        <!-- 显示模式 -->
        <template v-else-if="hasProfile">
          <a-descriptions bordered>
            <a-descriptions-item label="用户名" :span="1">{{ profile.username }}</a-descriptions-item>
            <a-descriptions-item label="昵称" :span="1">{{ profile.nickname || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="性别" :span="1">{{ profile.sex || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="年龄" :span="1">{{ profile.age || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="学历" :span="1">{{ profile.education || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="专业" :span="1">{{ profile.major || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="联系电话" :span="1">{{ profile.tel || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="电子邮箱" :span="1">{{ profile.email || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="期望工作" :span="1">{{ profile.expectedjob || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="毕业时间" :span="1">{{ formatDate(profile.graduationtime) }}</a-descriptions-item>
            <a-descriptions-item label="注册时间" :span="3">{{ formatDate(profile.registertime) }}</a-descriptions-item>
          </a-descriptions>
        </template>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <a-empty description="暂无个人信息，请点击创建按钮添加个人信息" />
        </div>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getUserByUsernameService, addUserService, updateUserService } from '@/api/user';
import type { UserInfo } from '@/types/user';

const route = useRoute();
const router = useRouter();
const username = computed(() => route.params.username as string);

const loading = ref(false);
const isEditing = ref(false);
const profile = ref<Partial<UserInfo>>({});
const hasProfile = computed(() => profile.value && Object.keys(profile.value).length > 0);

// 用于编辑的表单数据
const profileForm = reactive<{
  username: string;
  nickname: string;
  sex: string;
  age?: number;
  education: string;
  major: string;
  tel: string;
  email: string;
  expectedjob: string;
  graduationtime?: any; // 使用any类型来解决Dayjs类型问题
  [key: string]: any; // 添加索引签名
}>({
  username: '',
  nickname: '',
  sex: '',
  age: undefined,
  education: '',
  major: '',
  tel: '',
  email: '',
  expectedjob: '',
  graduationtime: undefined
});

// 获取用户信息
const fetchUserProfile = async () => {
  if (!username.value) return;
  
  loading.value = true;
  try {
    const res = await getUserByUsernameService(username.value);
    console.log('获取用户信息结果:', res);
    
    if (res.code === 0 && res.data) {
      profile.value = res.data;
    } else {
      // 用户信息不存在，可以稍后创建
      console.log('用户信息不存在:', res.message);
      // 确保profile至少是一个空对象
      profile.value = {};
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 发生错误时也确保profile是一个空对象
    profile.value = {};
  } finally {
    loading.value = false;
  }
};

// 开始编辑
const startEdit = () => {
  // 初始化表单数据，确保profile.value存在
  const profileData = profile.value || {};
  
  profileForm.username = username.value;
  profileForm.nickname = profileData.nickname || '';
  profileForm.sex = profileData.sex || '';
  profileForm.age = profileData.age;
  profileForm.education = profileData.education || '';
  profileForm.major = profileData.major || '';
  profileForm.tel = profileData.tel || '';
  profileForm.email = profileData.email || '';
  profileForm.expectedjob = profileData.expectedjob || '';
  
  // 处理日期
  if (profileData.graduationtime) {
    profileForm.graduationtime = dayjs(profileData.graduationtime);
  } else {
    profileForm.graduationtime = undefined;
  }
  
  isEditing.value = true;
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
};

// 保存用户信息
const handleSave = async () => {
  if (!profileForm.username) {
    message.error('用户名不能为空');
    return;
  }
  
  loading.value = true;
  try {
    // 处理日期格式
    const formData = { ...profileForm };
    if (formData.graduationtime && typeof formData.graduationtime !== 'string') {
      // 使用as any来避免类型错误
      formData.graduationtime = (formData.graduationtime as any).format('YYYY-MM-DD');
    }
    
    // 判断是新建还是更新
    const isNew = !profile.value || !profile.value.id;
    
    let res;
    if (isNew) {
      // 新建时设置注册时间为当前时间
      formData.registertime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      res = await addUserService(formData as Omit<UserInfo, 'id'>);
      console.log('添加用户信息结果:', res);
    } else {
      // 更新操作，保留原有id和registertime
      formData.id = profile.value.id;
      if (!formData.registertime && profile.value.registertime) {
        formData.registertime = profile.value.registertime;
      }
      res = await updateUserService(formData as UserInfo);
      console.log('更新用户信息结果:', res);
    }
    
    if (res.code === 0) {
      message.success(isNew ? '个人信息创建成功' : '个人信息更新成功');
      // 先退出编辑模式
      isEditing.value = false;
      
      // 保存成功后，重新获取用户信息
      setTimeout(async () => {
        try {
          loading.value = true;
          const refreshResult = await getUserByUsernameService(username.value);
          console.log('重新获取用户信息结果:', refreshResult);
          
          if (refreshResult.code === 0 && refreshResult.data) {
            profile.value = refreshResult.data;
          } else {
            console.log('获取最新用户信息失败:', refreshResult.message);
            profile.value = {}; // 确保至少有一个空对象
          }
        } catch (error) {
          console.error('重新获取用户信息时出错:', error);
          profile.value = {}; // 确保至少有一个空对象
        } finally {
          loading.value = false;
        }
      }, 200); // 稍微延迟一些时间，确保后端数据已更新
    } else {
      message.error(res.message || '保存失败');
    }
  } catch (error: any) {
    console.error('保存用户信息失败:', error);
    if (error.message) {
      message.error(error.message);
    } else {
      message.error('保存失败，请重试');
    }
  } finally {
    if (loading.value) {
      loading.value = false; // 只在没有进行二次请求时才在这里关闭加载状态
    }
  }
};

// 格式化日期显示
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '未设置';
  try {
    return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
  } catch (error) {
    return dateStr; // 如果格式化失败，返回原始字符串
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 30px auto;
}

.profile-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state {
  padding: 40px 0;
}

.ml-2 {
  margin-left: 8px;
}
</style> 