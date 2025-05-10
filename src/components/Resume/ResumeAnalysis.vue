<template>
  <div class="resume-analysis">
    <h2>简历分析</h2>
    <!-- 加载状态 -->
    <div v-if="isLoading">
      <p>正在加载分析结果，请稍候...</p>
    </div>
    <!-- 错误状态 -->
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>
    <!-- 分析结果 -->
    <div v-else-if="analysisResult">
      <el-card class="analysis-card">
        <div class="analysis-score">
          <h3>综合评分: {{ analysisResult.score }}/100</h3>
          <el-progress :percentage="analysisResult.score" />
        </div>
        <div class="analysis-details">
          <h4>优点</h4>
          <ul>
            <li v-for="(strength, index) in analysisResult.strengths" :key="index">
              {{ strength }}
            </li>
          </ul>
          <h4>改进建议</h4>
          <ul>
            <li v-for="(suggestion, index) in analysisResult.suggestions" :key="index">
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </el-card>
    </div>
    <!-- 无分析结果 -->
    <div v-else>
      <p>请先上传简历并提交分析。</p>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import {useRoute} from 'vue-router';

const route = useRoute();
const analysisResult = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  // 获取路由中的简历 ID 参数
  const resumeId = route.params.id;

  try {
    // 根据是否有简历 ID 来决定请求的接口
    const response = resumeId
        ? await axios.get(`/api/resume/analysis/${resumeId}`)
        : await axios.get('/api/resume/latest-analysis');

    analysisResult.value = response.data;
  } catch (err) {
    error.value = '获取分析结果失败，请稍后重试。';
    console.error('获取分析结果失败:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.resume-analysis {
  padding: 20px;
}

.analysis-card {
  margin-top: 20px;
  padding: 20px;
}

.analysis-score {
  margin-bottom: 20px;
}

.analysis-details ul {
  padding-left: 20px;
}
</style>