<template>
  <div class="job-details">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">加载失败：{{ error.message }}</div>

    <!-- 岗位详情内容 -->
    <div v-if="!isLoading && !error">
      <h2>{{ jobDetails.jobname }}</h2>
      <div class="detail-item">
        <span>公司：</span>{{ jobDetails.company }}
      </div>
      <div class="detail-item">
        <!-- 格式化薪资显示 -->
        <span>薪资：</span>{{ formatSalary(jobDetails.salary) }}
      </div>
      <div class="detail-item">
        <span>工作地点：</span>{{ jobDetails.location }}
      </div>
      <div class="detail-item">
        <span>工作经验：</span>{{ jobDetails.experience || "不限" }}
      </div>
      <div class="detail-item">
        <span>学历要求：</span>{{ jobDetails.education || "不限" }}
      </div>
      <div class="detail-item">
        <span>岗位类型：</span>{{ jobDetails.jobtype }}
      </div>
      <div class="detail-item">
        <span>岗位描述：</span>
        <pre>{{ jobDetails.jobdescription }}</pre>
      </div>
      <div class="detail-item">
        <span>岗位要求：</span>
        <pre>{{ jobDetails.requirement }}</pre>
      </div>
      <div class="detail-item">
        <!-- 格式化日期显示 -->
        <span>发布时间：</span>{{ formatDate(jobDetails.publishdate) }}
      </div>

      <!-- 岗位解读 -->
      <div v-if="jobInterpretation" class="interpretation">
        <h3>AI岗位解读</h3>
        <p>{{ jobInterpretation }}</p>
      </div>

      <!-- 岗位匹配 -->
      <div v-if="jobMatching !== null" class="matching">
        <h3>你的匹配度</h3>
        <!-- 确保匹配度在0-100之间 -->
        <p>{{ Math.min(Math.max(jobMatching, 0), 100) }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const jobDetails = ref({});
const jobInterpretation = ref(null);
const jobMatching = ref(null);
const isLoading = ref(true);
const error = ref(null);

// 格式化薪资显示
const formatSalary = (salary) => {
  if (!salary) return '面议';
  return `${salary} 元/月`;
};

// 格式化日期显示
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};

onMounted(async () => {
  try {
    // 获取岗位基础信息
    // 接口路径：GET /api/jobs/:id
    // 返回结构：{ id, jobname, company, ... }
    const detailsResponse = await axios.get(`/api/jobs/${route.params.id}`);
    jobDetails.value = detailsResponse.data;

    // 获取AI岗位解读（需要后端实现）
    // 接口路径：GET /api/jobs/:id/interpretation
    // 返回结构：{ interpretation: string }
    const interpretationResponse = await axios.get(`/api/jobs/${route.params.id}/interpretation`);
    jobInterpretation.value = interpretationResponse.data.interpretation;

    // 获取岗位匹配度（需要后端实现）
    // 接口路径：GET /api/jobs/:id/matching
    // 返回结构：{ matching: number }
    const matchingResponse = await axios.get(`/api/jobs/${route.params.id}/matching`);
    jobMatching.value = matchingResponse.data.matching;
  } catch (err) {
    error.value = {
      message: err.response?.data?.message || '获取数据失败，请稍后重试'
    };
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* 新增加载和错误样式 */
.loading, .error {
  padding: 20px;
  text-align: center;
  font-size: 16px;
}

.error {
  color: #ff4444;
}

.job-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.detail-item {
  margin-bottom: 15px;
  font-size: 16px;
  line-height: 1.6;
}

.detail-item span {
  font-weight: bold;
  color: #2c3e50;
  margin-right: 10px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

.interpretation,
.matching {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.interpretation h3,
.matching h3 {
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 15px;
}

.matching p {
  font-size: 24px;
  color: #42b983;
  font-weight: bold;
}
</style>