<template>
  <div class="user-management-container" :class="{ 'dark-mode': settingsStore.isDark }">
    <a-card title="用户管理" :bordered="false">
      <!-- 搜索和过滤区域 -->
      <div class="filter-container">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="用户名/昵称/邮箱"
              @search="handleSearch"
              allow-clear
            />
          </a-col>
          <a-col :span="5">
            <a-select
              v-model:value="educationFilter"
              placeholder="选择学历"
              style="width: 100%"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="高中">高中</a-select-option>
              <a-select-option value="专科">专科</a-select-option>
              <a-select-option value="本科">本科</a-select-option>
              <a-select-option value="硕士">硕士</a-select-option>
              <a-select-option value="博士">博士</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="5">
            <a-button type="primary" @click="showCreateModal">
              <PlusOutlined /> 新建用户
            </a-button>
          </a-col>
        </a-row>
      </div>

      <!-- 用户表格 -->
      <a-table
        :dataSource="paginatedUsers"
        :columns="columns"
        :pagination="false"
        :loading="loading"
        rowKey="id"
        :scroll="{ x: 1100 }"
      >
        <!-- 性别列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'sex'">
            <span>
              <a-tag :color="getSexTagColor(record.sex)">
                {{ record.sex || '未设置' }}
              </a-tag>
            </span>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <span class="action-links">
              <a @click="viewProfile(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="editUser(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除该用户吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteUser(record)"
              >
                <a class="delete-link">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>

      <!-- 分页器 -->
      <div class="pagination-container">
        <a-pagination
          v-model:current="currentPage"
          :total="filteredUsers.length"
          :pageSize="pageSize"
          show-size-changer
          :pageSizeOptions="['10', '20', '50', '100']"
          @change="handlePageChange"
          @showSizeChange="handleSizeChange"
          :locale="{
            items_per_page: '条/页',
            prev_page: '上一页',
            next_page: '下一页',
            prev_5: '向前 5 页',
            next_5: '向后 5 页'
          }"
        />
      </div>
    </a-card>

    <!-- 用户表单对话框 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="editingUser ? '编辑用户' : '新建用户'"
      @ok="handleSubmit"
      @cancel="modalVisible = false"
      ok-text="确定"
      cancel-text="取消"
      :width="700"
      :confirmLoading="submitLoading"
      :class="{ 'dark-modal': settingsStore.isDark }"
      :wrapClassName="settingsStore.isDark ? 'dark-modal-wrap' : ''"
    >
      <a-form :model="userForm" layout="vertical" ref="userFormRef">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
              <a-input v-model:value="userForm.username" placeholder="请输入用户名" :disabled="!!editingUser" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="userForm.nickname" placeholder="请输入昵称" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="性别" name="sex">
              <a-select v-model:value="userForm.sex" placeholder="请选择性别">
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
                <a-select-option value="保密">保密</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="年龄" name="age">
              <a-input-number v-model:value="userForm.age" :min="0" :max="100" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="学历" name="education">
              <a-select v-model:value="userForm.education" placeholder="请选择学历">
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
              <a-input v-model:value="userForm.major" placeholder="请输入专业" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="联系电话" name="tel">
              <a-input v-model:value="userForm.tel" placeholder="请输入联系电话" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="电子邮箱" name="email">
              <a-input v-model:value="userForm.email" placeholder="请输入电子邮箱" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="期望工作" name="expectedjob">
              <a-input v-model:value="userForm.expectedjob" placeholder="请输入期望工作" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="毕业时间" name="graduationtime">
              <a-date-picker 
                v-model:value="userForm.graduationtime" 
                format="YYYY-MM-DD" 
                style="width: 100%" 
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { 
  getUserListService, 
  addUserService, 
  updateUserService, 
  deleteUserService 
} from '@/api/user';
import type { UserInfo } from '@/types/user';
import { useSettingsStore } from '@/store/useSettingsStore';

const router = useRouter();
const settingsStore = useSettingsStore();
const isDark = computed(() => settingsStore.isDark);
const loading = ref(false);
const allUsers = ref<UserInfo[]>([]);

// 筛选和搜索
const searchKeyword = ref('');
const educationFilter = ref<string | undefined>(undefined);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 表单相关
const modalVisible = ref(false);
const submitLoading = ref(false);
const editingUser = ref<UserInfo | null>(null);
const userFormRef = ref();

// 表单数据
const userForm = reactive<Partial<UserInfo> & { graduationtime?: any }>({
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

// 获取性别标签颜色
const getSexTagColor = (sex: string | undefined) => {
  if (isDark.value) {
    // 暗黑模式下的颜色
    switch (sex) {
      case '男': return '#1668dc'; // 更亮的蓝色
      case '女': return '#eb2f96'; // 更亮的粉色
      case '保密': return '#d89614';   // 更亮的黄/橙色用于"保密"
      default: return '#d89614';   // 更亮的黄/橙色
    }
  } else {
    // 明亮模式下的颜色
    switch (sex) {
      case '男': return 'blue';
      case '女': return 'pink';
      case '保密': return 'orange';
      default: return 'default';   // 默认标签颜色
    }
  }
};

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 120
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    width: 80
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80
  },
  {
    title: '学历',
    dataIndex: 'education',
    key: 'education',
    width: 100
  },
  {
    title: '专业',
    dataIndex: 'major',
    key: 'major',
    width: 160
  },
  {
    title: '期望工作',
    dataIndex: 'expectedjob',
    key: 'expectedjob',
    width: 160
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 180
  }
];

// 经过筛选的用户列表
const filteredUsers = computed(() => {
  let result = [...allUsers.value];
  
  // 应用关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(user => 
      (user.username && user.username.toLowerCase().includes(keyword)) ||
      (user.nickname && user.nickname.toLowerCase().includes(keyword)) ||
      (user.email && user.email.toLowerCase().includes(keyword))
    );
  }
  
  // 应用学历筛选
  if (educationFilter.value) {
    result = result.filter(user => user.education === educationFilter.value);
  }
  
  return result;
});

// 分页后的用户列表
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredUsers.value.slice(startIndex, startIndex + pageSize.value);
});

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await getUserListService();
    if (res.code === 0) {
      allUsers.value = res.data;
    } else {
      message.error(res.message || '获取用户列表失败');
    }
  } catch (error) {
    console.error('获取用户列表错误:', error);
    message.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1; // 重置为第一页
};

// 处理筛选变化
const handleFilterChange = () => {
  currentPage.value = 1; // 重置为第一页
};

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 处理每页条数变化
const handleSizeChange = (_: number, size: number) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置为第一页
};

// 显示创建用户对话框
const showCreateModal = () => {
  editingUser.value = null;
  resetForm();
  modalVisible.value = true;
};

// 编辑用户
const editUser = (user: UserInfo) => {
  editingUser.value = user;
  resetForm();
  
  // 填充表单数据
  userForm.id = user.id;
  userForm.username = user.username;
  userForm.nickname = user.nickname || '';
  userForm.sex = user.sex || '';
  userForm.age = user.age;
  userForm.education = user.education || '';
  userForm.major = user.major || '';
  userForm.tel = user.tel || '';
  userForm.email = user.email || '';
  userForm.expectedjob = user.expectedjob || '';
  
  // 处理日期
  if (user.graduationtime) {
    userForm.graduationtime = dayjs(user.graduationtime);
  } else {
    userForm.graduationtime = undefined;
  }
  
  modalVisible.value = true;
};

// 查看用户详情
const viewProfile = (user: UserInfo) => {
  router.push(`/profile/${user.username}`);
};

// 删除用户
const deleteUser = async (user: UserInfo) => {
  loading.value = true;
  try {
    const res = await deleteUserService(user.id);
    if (res.code === 0) {
      message.success('删除用户成功');
      await fetchUsers(); // 重新获取用户列表
    } else {
      message.error(res.message || '删除失败');
    }
  } catch (error) {
    console.error('删除用户错误:', error);
    message.error('删除用户失败');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  userForm.id = undefined;
  userForm.username = '';
  userForm.nickname = '';
  userForm.sex = '';
  userForm.age = undefined;
  userForm.education = '';
  userForm.major = '';
  userForm.tel = '';
  userForm.email = '';
  userForm.expectedjob = '';
  userForm.graduationtime = undefined;
  
  if (userFormRef.value) {
    userFormRef.value.resetFields();
  }
};

// 处理表单提交
const handleSubmit = async () => {
  if (!userForm.username) {
    message.error('用户名不能为空');
    return;
  }
  
  submitLoading.value = true;
  try {
    // 处理日期格式
    const formData = { ...userForm };
    if (formData.graduationtime && typeof formData.graduationtime !== 'string') {
      formData.graduationtime = formData.graduationtime.format('YYYY-MM-DD');
    }
    
    let res;
    if (editingUser.value) {
      // 更新操作
      res = await updateUserService(formData as UserInfo);
    } else {
      // 新建操作，设置注册时间
      formData.registertime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      res = await addUserService(formData as Omit<UserInfo, 'id'>);
    }
    
    if (res.code === 0) {
      message.success(editingUser.value ? '更新用户成功' : '创建用户成功');
      modalVisible.value = false;
      await fetchUsers(); // 重新获取用户列表
    } else {
      message.error(res.message || '操作失败');
    }
  } catch (error) {
    console.error('保存用户信息错误:', error);
    message.error('保存失败');
  } finally {
    submitLoading.value = false;
  }
};

// 页面加载时获取用户列表
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.delete-link {
  color: #ff4d4f;
}

/* 暗黑模式下的颜色调整 */
.dark-mode :deep(.ant-card) {
  background-color: #1E1E2E;
  color: #cdd6f4;
  border-color: #313244;
}

.dark-mode :deep(.ant-card-head) {
  background-color: #313244;
  color: #cdd6f4;
  border-color: #45475a;
}

.dark-mode :deep(.ant-input),
.dark-mode :deep(.ant-input-password .ant-input),
.dark-mode :deep(.ant-input-number-input) {
  background-color: #2c2e3b;
  border-color: #45475a;
  color: #fff;
}

.dark-mode :deep(.ant-input-affix-wrapper),
.dark-mode :deep(.ant-input-password),
.dark-mode :deep(.ant-input-number),
.dark-mode :deep(.ant-picker) {
  background-color: #2c2e3b;
  border-color: #45475a;
}

.dark-mode :deep(.ant-select-selector) {
  background-color: #2c2e3b !important;
  border-color: #45475a !important;
  color: #fff !important;
}

.dark-mode :deep(.ant-select-selection-placeholder),
.dark-mode :deep(.ant-input::placeholder),
.dark-mode :deep(.ant-input-search .ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dark-mode :deep(.ant-select-arrow) {
  color: #9c87fe;
}

.dark-mode :deep(.ant-btn-primary) {
  background-color: #9c87fe;
  border-color: #9c87fe;
}

.dark-mode :deep(.ant-table) {
  background-color: #1E1E2E;
  color: #cdd6f4;
}

.dark-mode :deep(.ant-table-thead > tr > th) {
  background-color: #313244;
  color: #cdd6f4;
  border-color: #45475a;
}

/* 固定列表头样式 */
.dark-mode :deep(.ant-table-thead > tr > th.ant-table-cell-fix-right),
.dark-mode :deep(.ant-table-thead > tr > th.ant-table-cell-fix-left) {
  background-color: #313244 !important;
  color: #cdd6f4 !important;
}

.dark-mode :deep(.ant-table-tbody > tr > td) {
  border-color: #45475a;
  color: #cdd6f4;
}

.dark-mode :deep(.ant-table-tbody > tr) {
  background-color: #1E1E2E;
}

.dark-mode :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #313244 !important;
}

.dark-mode :deep(.ant-table-row-selected > td) {
  background-color: #313244 !important;
}

.dark-mode :deep(.ant-pagination-item) {
  background-color: #2c2e3b;
  border-color: #45475a;
}

.dark-mode :deep(.ant-pagination-item a) {
  color: #cdd6f4;
}

.dark-mode :deep(.ant-pagination-item-active) {
  border-color: #9c87fe;
}

.dark-mode :deep(.ant-pagination-item-active a) {
  color: #9c87fe;
}

/* 操作列链接颜色调整 */
.dark-mode .action-links a {
  color: #1890ff;
}

.dark-mode .action-links .delete-link {
  color: #ff4d4f;
}

/* 性别标签颜色 */
.dark-mode :deep(.ant-tag) {
  background: #3a3a3c;
  border-color: #3a3a3c;
  color: #d8d8d8;
}

/* 针对固定列的样式 */
.dark-mode :deep(.ant-table-cell-fix-right),
.dark-mode :deep(.ant-table-cell-fix-left) {
  background-color: #1E1E2E !important;
}

.dark-mode :deep(.ant-table-tbody > tr:hover .ant-table-cell-fix-right),
.dark-mode :deep(.ant-table-tbody > tr:hover .ant-table-cell-fix-left) {
  background-color: #313244 !important;
}

/* 模态框暗黑模式 */
.dark-modal :deep(.ant-modal-content) {
  background-color: #1E1E2E;
}

.dark-modal :deep(.ant-modal-header) {
  background-color: #1E1E2E;
  border-bottom: 1px solid #45475a;
}

.dark-modal :deep(.ant-modal-title) {
  color: #cdd6f4;
}

.dark-modal :deep(.ant-modal-footer) {
  border-top: 1px solid #45475a;
}

/* 模态框内表单元素暗黑模式 */
.dark-modal :deep(.ant-form-item-label > label) {
  color: #cdd6f4;
}

.dark-modal :deep(.ant-input),
.dark-modal :deep(.ant-input-number-input),
.dark-modal :deep(.ant-picker-input > input) {
  background-color: #2c2e3b;
  border-color: #45475a;
  color: #fff;
}

.dark-modal :deep(.ant-input::placeholder),
.dark-modal :deep(.ant-picker-input > input::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.dark-modal :deep(.ant-input-affix-wrapper),
.dark-modal :deep(.ant-input-number),
.dark-modal :deep(.ant-picker) {
  background-color: #2c2e3b;
  border-color: #45475a;
}

.dark-modal :deep(.ant-select-selector) {
  background-color: #2c2e3b !important;
  border-color: #45475a !important;
  color: #fff !important;
}

.dark-modal :deep(.ant-select-selection-placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dark-modal :deep(.ant-select-arrow),
.dark-modal :deep(.ant-picker-suffix) {
  color: #9c87fe;
}
</style>

<style>
/* 全局样式，适用于挂载在body下的模态框 */
.dark-modal-wrap .ant-modal-content,
.dark-modal-wrap .ant-modal-header {
  background-color: #1E1E2E !important;
  color: #cdd6f4 !important;
}

.dark-modal-wrap .ant-modal-header {
  border-bottom: 1px solid #45475a !important;
}

.dark-modal-wrap .ant-modal-title {
  color: #cdd6f4 !important;
}

.dark-modal-wrap .ant-modal-footer {
  border-top: 1px solid #45475a !important;
}

.dark-modal-wrap .ant-form-item-label > label {
  color: #cdd6f4 !important;
}

.dark-modal-wrap .ant-input,
.dark-modal-wrap .ant-input-number-input,
.dark-modal-wrap .ant-picker-input > input {
  background-color: #2c2e3b !important;
  border-color: #45475a !important;
  color: #fff !important;
}

.dark-modal-wrap .ant-input::placeholder,
.dark-modal-wrap .ant-picker-input > input::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dark-modal-wrap .ant-input-affix-wrapper,
.dark-modal-wrap .ant-input-number,
.dark-modal-wrap .ant-picker {
  background-color: #2c2e3b !important;
  border-color: #45475a !important;
}

.dark-modal-wrap .ant-select-selector {
  background-color: #2c2e3b !important;
  border-color: #45475a !important;
  color: #fff !important;
}

.dark-modal-wrap .ant-select-selection-placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dark-modal-wrap .ant-select-arrow,
.dark-modal-wrap .ant-picker-suffix {
  color: #9c87fe !important;
}

.dark-modal-wrap .ant-modal-close {
  color: #cdd6f4 !important;
}

.dark-modal-wrap .ant-btn-default {
  background-color: #313244 !important;
  border-color: #45475a !important;
  color: #cdd6f4 !important;
}

.dark-modal-wrap .ant-btn-primary {
  background-color: #9c87fe !important;
  border-color: #9c87fe !important;
}

/* 暗黑模式下的下拉菜单样式 */
body.dark .ant-select-dropdown {
  background-color: #1E1E2E !important;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 9px 28px 8px rgba(0, 0, 0, 0.2) !important;
}

body.dark .ant-select-item {
  color: #cdd6f4 !important;
}

body.dark .ant-select-item-option-content {
  color: #cdd6f4 !important;
}

body.dark .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
  background-color: #313244 !important;
}

body.dark .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  background-color: #45475a !important;
  color: #ffffff !important;
}

body.dark .ant-select-dropdown .rc-virtual-list-holder-inner {
  background-color: #1E1E2E !important;
}

body.dark .ant-empty-description {
  color: #cdd6f4 !important;
}

body.dark .ant-select-item-empty {
  color: #cdd6f4 !important;
}
</style> 