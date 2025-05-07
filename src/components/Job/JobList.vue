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
          @click="viewJobDetails(job)"
      >
        <div class="job-header">
          <div class="job-location">{{ job.location }}</div>
          <div class="job-title">{{ job.jobname }}</div>
        </div>
        <div class="job-salary" style="color: #ff4400; font-size: 18px; font-weight: bold;">
          {{ job.salary }} 元/月
        </div>
        <div class="job-basic-info">
          <div class="job-company">{{ job.company }}</div>
          <div class="job-experience-edu">
            {{ job.experience }}｜{{ job.education }}｜{{ job.jobtype }}
          </div>
        </div>
        <div class="job-publishdate">发布时间：{{ job.publishdate }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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

// 生命周期函数：组件挂载后调用后端接口获取岗位数据
onMounted(async () => {
  try {
    // 调用后端接口获取岗位数据（请根据实际地址调整接口路径）
    // 接口返回数据应包含字段：id, jobname, company, salary, location, experience, education, jobtype, publishdate 等
    const response = await axios.get('/api/jobs');
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
  height: 320px; /* 调整高度适配内容 */
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
</style>