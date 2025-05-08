<template>
  <div class="job-list">
    <h2>岗位列表</h2>
    <el-input
        v-model="searchQuery"
        placeholder="搜索岗位..."
        prefix-icon="el-icon-search"
        style="margin-bottom: 20px; width: 300px;"
    ></el-input>

    <!-- 加载状态显示 -->
    <div v-if="isLoading" class="loading">加载中...</div>
    <!-- 错误提示显示 -->
    <div v-else-if="error" class="error">
      <p>数据加载失败，请检查网络或重试</p>
      <p>{{ error.message }}</p>
    </div>

    <!-- 岗位列表显示（当数据加载成功且无错误时） -->
    <div v-else class="job-grid">
      <div
          v-for="job in filteredJobs"
          :key="job.id"
          class="job-card-square"
      >
        <div class="job-header" @click="viewJobDetails(job)">
          <div class="job-location">{{ job.location }}</div>
          <div class="job-title">{{ job.jobname }}</div>
        </div>
        <div class="job-salary" style="color: #ff4400; font-size: 18px; font-weight: bold;" @click="viewJobDetails(job)">
          {{ job.salary }} 元/月
        </div>
        <div class="job-basic-info" @click="viewJobDetails(job)">
          <div class="job-company">{{ job.company }}</div>
          <div class="job-experience-edu">
            {{ job.experience }}｜{{ job.education }}｜{{ job.jobtype }}
          </div>
        </div>
        <div class="job-publishdate" @click="viewJobDetails(job)">发布时间：{{ job.publishdate }}</div>
        
        <!-- 添加投递简历按钮 -->
        <div class="job-actions">
          <el-button type="primary" size="small" @click.stop="applyJob(job)">投递简历</el-button>
        </div>
      </div>
    </div>
    
    <!-- 投递成功/失败提示对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="30%"
      center
    >
      <span>{{ dialogMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getAllJobsService } from '@/api/job';
import { createJobApplyService } from '@/api/jobApply';
import { useAccountInfoStore } from '@/store/account';

// 存储岗位数据
const jobs = ref([]);
// 搜索关键词
const searchQuery = ref('');
// 加载状态
const isLoading = ref(true);
// 错误信息
const error = ref(null);
// 路由实例
const router = useRouter();
// 账户信息存储
const accountStore = useAccountInfoStore();
// 对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');

// 生命周期函数：组件挂载后调用后端接口获取岗位数据
onMounted(async () => {
  try {
    // 使用封装的API服务获取岗位数据
    const response = await getAllJobsService();
    jobs.value = response.data;
  } catch (err) {
    error.value = err;
  } finally {
    isLoading.value = false;
  }
});

// 计算属性：根据搜索关键词过滤岗位列表
const filteredJobs = computed(() => {
  if (!searchQuery.value) return jobs.value;
  const query = searchQuery.value.toLowerCase();
  return jobs.value.filter(
      (job) =>
          job.jobname.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
  );
});

// 点击岗位卡片跳转到详情页
const viewJobDetails = (job) => {
  router.push({ name: 'JobDetails', params: { id: job.id } });
};

// 投递简历函数
const applyJob = async (job) => {
  // 检查用户是否登录
  if (!accountStore.info || !accountStore.info.username) {
    dialogTitle.value = '投递失败';
    dialogMessage.value = '请先登录后再投递简历';
    dialogVisible.value = true;
    return;
  }
  
  try {
    // 准备投递数据
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
    
    const jobApplyData = {
      username: accountStore.info.username,
      jobid: job.id,
      applydate: formattedDate,
      status: '已投递' // 修改为已投递状态
    };
    
    // 调用API投递简历
    const response = await createJobApplyService(jobApplyData);
    
    // 投递成功提示
    dialogTitle.value = '投递成功';
    dialogMessage.value = `您已成功投递"${job.jobname}"职位的简历，请等待企业回复`;
    dialogVisible.value = true;
  } catch (err) {
    console.error('投递简历失败:', err);
    // 投递失败提示
    dialogTitle.value = '投递失败';
    dialogMessage.value = err.response?.data?.message || '投递简历失败，请稍后重试';
    dialogVisible.value = true;
  }
};
</script>

<style scoped>
.job-list {
  padding: 20px;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error {
  color: #f5222d;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.job-card-square {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 350px; /* 略微增加高度以容纳按钮 */
  position: relative;
}

.job-card-square:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.job-location {
  color: #666;
  font-size: 14px;
}

.job-title {
  font-size: 16px;
  font-weight: bold;
}

.job-basic-info {
  margin-top: 10px;
}

.job-company {
  color: #666;
  margin-bottom: 5px;
}

.job-experience-edu {
  color: #999;
  font-size: 14px;
}

.job-publishdate {
  color: #999;
  font-size: 12px;
  margin-top: 10px;
}

/* 新增投递简历按钮样式 */
.job-actions {
  margin-top: 15px;
  text-align: center;
}
</style>