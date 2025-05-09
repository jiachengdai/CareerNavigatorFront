<template>
  <div class="job-list">
    <h2 class="job-list-title">岗位列表</h2>
    <el-input
        v-model="searchQuery"
        placeholder="搜索岗位..."
        prefix-icon="el-icon-search"
        class="search-input"
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
        <div class="job-card-content" @click="viewJobDetails(job)">
          <div class="job-left">
            <div class="job-title">{{ job.jobname }}</div>
            <div class="job-company">{{ job.company }}</div>
            <div class="job-tags">
              <span class="job-tag">{{ job.experience }}</span>
              <span class="job-tag">{{ job.education }}</span>
              <span class="job-tag">{{ job.jobtype }}</span>
              <span class="job-tag location">{{ job.location }}</span>
            </div>
            <div class="job-publishdate">发布时间：{{ job.publishdate }}</div>
          </div>
          
          <div class="job-right">
            <div class="job-salary">{{ job.salary }} 元/月</div>
            <!-- 添加投递简历按钮 -->
            <div class="job-actions">
              <el-button type="primary" size="small" @click.stop="applyJob(job)" class="apply-btn">投递简历</el-button>
            </div>
          </div>
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
  padding: 30px;
  background-color: #f9fafc;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
}

.job-list-title {
  margin-bottom: 25px;
  color: #303133;
  text-align: center;
  font-size: 28px;
  position: relative;
}

.job-list-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background-color: #409eff;
  margin: 10px auto 0;
}

.search-input {
  margin-bottom: 25px;
  width: 400px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.loading,
.error {
  padding: 30px;
  text-align: center;
  color: #666;
  font-size: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-top: 20px;
}

.error {
  color: #f56c6c;
  border-left: 4px solid #f56c6c;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
}

.job-card-square {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.job-card-square:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #dcdfe6;
}

.job-card-content {
  display: flex;
  justify-content: space-between;
}

.job-left {
  flex: 1;
  overflow: hidden;
  padding-right: 15px;
}

.job-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  min-width: 120px;
}

.job-title {
  font-size: 17px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-company {
  color: #409eff;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.job-tag {
  color: #606266;
  font-size: 12px;
  background-color: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.job-tag.location {
  color: #409eff;
  background-color: #ecf5ff;
}

.job-publishdate {
  color: #909399;
  font-size: 12px;
}

.job-salary {
  color: #ff4400;
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  margin-bottom: 40px;
}

.job-actions {
  text-align: right;
}

.apply-btn {
  width: 110px;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s;
  height: 32px;
  padding: 0;
}

.apply-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.5);
}

@media (max-width: 768px) {
  .job-grid {
    grid-template-columns: 1fr;
  }
  
  .search-input {
    width: 100%;
  }
  
  .job-card-content {
    flex-direction: column;
  }
  
  .job-left {
    padding-right: 0;
    margin-bottom: 15px;
  }
  
  .job-right {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .job-salary {
    margin-bottom: 0;
  }
}
</style>