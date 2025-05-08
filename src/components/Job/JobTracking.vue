<template>
  <div class="job-tracking">
    <h2>职位追踪</h2>
    
    <!-- 筛选和排序控件 - 移到外面，始终显示 -->
    <div class="filters">
      <label for="status-filter">状态筛选:</label>
      <select v-model="selectedStatus" @change="filterJobs">
        <option value="all">全部</option>
        <option value="已投递">已投递</option>
        <option value="初筛通过">初筛通过</option>
        <option value="面试中">面试中</option>
        <option value="已录用">已录用</option>
        <option value="已拒绝">已拒绝</option>
      </select>
      <label for="sort-order">排序:</label>
      <select v-model="sortOrder" @change="sortJobs">
        <option value="dateAppliedAsc">申请日期升序</option>
        <option value="dateAppliedDesc">申请日期降序</option>
      </select>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">加载中...</div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error">
      <p>数据加载失败: {{ error.message }}</p>
      <el-button type="primary" size="small" @click="loadApplyRecords">重试</el-button>
    </div>
    
    <!-- 无数据提示 -->
    <div v-else-if="filteredJobs.length === 0" class="no-data">
      <p>暂无投递记录</p>
      <el-button type="primary" @click="goToJobList">去投递简历</el-button>
    </div>
    
    <!-- 有数据时显示 -->
    <div v-else>      
      <!-- 职位列表 -->
      <table>
        <thead>
        <tr>
          <th>投递记录编号</th>
          <th>岗位名称</th>
          <th>公司名称</th>
          <th>申请日期</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="job in filteredJobs" :key="job.id">
          <td>{{ job.id }}</td>
          <td>{{ getJobName(job.jobid || job.jobId) }}</td>
          <td>{{ getCompanyName(job.jobid || job.jobId) }}</td>
          <td>{{ formatDate(job.applydate) }}</td>
          <td>
            <span :class="getStatusClass(job.status)">{{ job.status }}</span>
          </td>
          <td>
            <el-button type="text" size="small" @click="viewJobDetails(job.jobid || job.jobId)">查看职位详情</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getApplyRecordsByUserService } from '@/api/jobApply';
import { getAllJobsService } from '@/api/job';
import { useAccountInfoStore } from '@/store/account';

// 路由实例
const router = useRouter();
// 账户信息存储
const accountStore = useAccountInfoStore();
// 加载状态
const isLoading = ref(true);
// 错误信息
const error = ref(null);
// 投递记录数据
const jobs = ref([]);
// 岗位数据
const allJobs = ref([]);
// 筛选状态
const selectedStatus = ref('all');
// 排序顺序
const sortOrder = ref('dateAppliedDesc');

// 获取岗位详细信息
const getJobDetails = (jobId) => {
  if (!jobId) return null;
  return allJobs.value.find(job => job.id === jobId);
};

// 计算筛选和排序后的职位列表
const filteredJobs = computed(() => {
  let filtered = jobs.value;
  // 筛选逻辑
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(job => job.status === selectedStatus.value);
  }
  // 排序逻辑
  if (sortOrder.value === 'dateAppliedAsc') {
    filtered.sort((a, b) => new Date(a.applydate) - new Date(b.applydate));
  } else if (sortOrder.value === 'dateAppliedDesc') {
    filtered.sort((a, b) => new Date(b.applydate) - new Date(a.applydate));
  }
  return filtered;
});

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知日期';
  const date = new Date(dateString);
  return isNaN(date.getTime()) 
    ? dateString 
    : date.toLocaleDateString('zh-CN');
};

// 获取状态对应的样式类
const getStatusClass = (status) => {
  const statusMap = {
    '已投递': 'status-applied',
    '初筛通过': 'status-passed',
    '面试中': 'status-interviewing',
    '已录用': 'status-offered',
    '已拒绝': 'status-rejected'
  };
  return statusMap[status] || 'status-default';
};

// 加载岗位数据
const loadJobData = async () => {
  try {
    const response = await getAllJobsService();
    if (response && response.data) {
      allJobs.value = response.data;
    } else if (response && response.code === 0 && response.data) {
      allJobs.value = response.data;
    }
  } catch (err) {
    console.error('获取岗位数据失败:', err);
  }
};

// 加载投递记录
const loadApplyRecords = async () => {
  isLoading.value = true;
  error.value = null;
  
  // 确保岗位数据已加载
  await loadJobData();
  
  // 检查用户是否登录
  if (!accountStore.info || !accountStore.info.username) {
    isLoading.value = false;
    error.value = { message: '请先登录后查看投递记录' };
    return;
  }
  
  try {
    const response = await getApplyRecordsByUserService(accountStore.info.username);
    console.log('投递记录响应:', response);
    
    if (response && response.data) {
      jobs.value = response.data;
    } else if (response && response.code === 0 && response.data) {
      jobs.value = response.data;
    } else {
      jobs.value = [];
    }
  } catch (err) {
    console.error('获取投递记录失败:', err);
    error.value = { 
      message: err.response?.data?.message || '获取投递记录失败，请稍后重试' 
    };
  } finally {
    isLoading.value = false;
  }
};

// 跳转到岗位列表页
const goToJobList = () => {
  router.push({ name: 'JobList' });
};

// 查看岗位详情
const viewJobDetails = (jobId) => {
  if (!jobId) {
    ElMessage.warning('无法查看详情，未找到岗位ID');
    return;
  }
  router.push({ name: 'JobDetails', params: { id: jobId } });
};

// 筛选职位
const filterJobs = () => {
  // 筛选时自动重新计算 filteredJobs
};

// 排序职位
const sortJobs = () => {
  // 排序时自动重新计算 filteredJobs
};

// 获取岗位名称
const getJobName = (jobId) => {
  const jobDetail = getJobDetails(jobId);
  return jobDetail ? jobDetail.jobname : `岗位 #${jobId}`;
};

// 获取公司名称
const getCompanyName = (jobId) => {
  const jobDetail = getJobDetails(jobId);
  return jobDetail ? jobDetail.company : '未知公司';
};

// 组件挂载时加载数据
onMounted(loadApplyRecords);
</script>

<style scoped>
.job-tracking {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.loading, .error, .no-data {
  padding: 40px 0;
  text-align: center;
  color: #666;
}

.error {
  color: #f56c6c;
}

.error p {
  margin-bottom: 15px;
}

.no-data {
  padding: 60px 0;
}

.no-data p {
  margin-bottom: 20px;
  color: #909399;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filters select {
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ebeef5;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
}

/* 状态样式 */
.status-applied {
  color: #909399;
}

.status-passed {
  color: #409eff;
}

.status-interviewing {
  color: #e6a23c;
}

.status-offered {
  color: #67c23a;
}

.status-rejected {
  color: #f56c6c;
}

.status-default {
  color: #606266;
}
</style>