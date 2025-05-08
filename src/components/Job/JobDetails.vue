<template>
  <div class="job-details">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">加载失败：{{ error.message }}</div>

    <!-- 岗位详情内容 -->
    <div v-if="!isLoading && !error">
      <div class="job-header">
        <h2>{{ jobDetails.jobname }}</h2>
        <!-- 添加投递简历按钮 -->
        <el-button type="primary" @click="applyJob">投递简历</el-button>
      </div>
      
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
      <div class="interpretation">
        <h3>AI岗位解读</h3>
        <!-- AI解读加载中状态 -->
        <div v-if="analyzeLoading" class="analyze-loading">
          <span>AI解读中</span>
          <span class="loading-dots">
            <i></i><i></i><i></i>
          </span>
        </div>
        <!-- AI解读内容 -->
        <div v-else-if="jobInterpretation" v-html="renderMarkdown(jobInterpretation)" class="markdown-content"></div>
        <div v-else class="no-interpretation">暂无岗位解读</div>
      </div>

      <!-- 岗位匹配 -->
      <div v-if="jobMatching !== null" class="matching">
        <h3>你的匹配度</h3>
        <!-- 确保匹配度在0-100之间 -->
        <p>{{ Math.min(Math.max(jobMatching, 0), 100) }}%</p>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getJobByIdService, analyzeJobService } from '@/api/job';
import { createJobApplyService } from '@/api/jobApply'; 
import { useAccountInfoStore } from '@/store/account';
import { marked } from 'marked';

const route = useRoute();
const jobDetails = ref({});
const jobInterpretation = ref(null);
const jobMatching = ref(null);
const isLoading = ref(true);
const error = ref(null);
// 新增AI解读加载状态
const analyzeLoading = ref(false);
// 投递对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
// 账户信息
const accountStore = useAccountInfoStore();

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

// 渲染Markdown为HTML
const renderMarkdown = (content) => {
  if (!content) return '';
  return marked(content);
};

// 投递简历函数
const applyJob = async () => {
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
      jobid: jobDetails.value.id,
      applydate: formattedDate,
      status: '已投递' // 修改为已投递状态
    };
    
    // 调用API投递简历
    const response = await createJobApplyService(jobApplyData);
    
    // 投递成功提示
    dialogTitle.value = '投递成功';
    dialogMessage.value = `您已成功投递"${jobDetails.value.jobname}"职位的简历，请等待企业回复`;
    dialogVisible.value = true;
  } catch (err) {
    console.error('投递简历失败:', err);
    // 投递失败提示
    dialogTitle.value = '投递失败';
    dialogMessage.value = err.response?.data?.message || '投递简历失败，请稍后重试';
    dialogVisible.value = true;
  }
};

// 模拟数据 - 用于开发测试，确保UI能够显示
const mockJobData = {
  id: 1,
  jobname: "前端开发工程师",
  company: "示例科技有限公司",
  salary: "15000-25000",
  location: "上海",
  experience: "3-5年",
  education: "本科",
  jobtype: "全职",
  jobdescription: "负责公司产品的前端开发，包括但不限于Web应用、移动端适配等。使用Vue.js、React等前端框架。",
  requirement: "1. 熟悉HTML、CSS、JavaScript\n2. 熟练掌握Vue.js或React\n3. 了解前端工程化和常用构建工具",
  publishdate: "2023-05-15"
};

onMounted(async () => {
  // 立即显示模拟数据，确保UI不再显示加载中
  jobDetails.value = mockJobData;
  isLoading.value = false;
  
  try {
    // 后台请求真实数据
    const detailsResponse = await getJobByIdService(route.params.id);
    console.log('岗位详情响应:', detailsResponse);
    
    // 如果成功获取到数据则替换模拟数据
    if (detailsResponse && detailsResponse.data) {
      jobDetails.value = detailsResponse.data;
    } else if (detailsResponse && detailsResponse.code === 0) {
      jobDetails.value = detailsResponse.data || detailsResponse;
    }
    
    // 获取AI岗位解读（单独处理，显示加载状态）
    analyzeLoading.value = true;
    try {
      const interpretationResponse = await analyzeJobService(route.params.id);
      console.log('岗位解读响应:', interpretationResponse);
      
      if (interpretationResponse && typeof interpretationResponse === 'string') {
        // 如果直接返回了字符串
        jobInterpretation.value = interpretationResponse;
      } else if (interpretationResponse && interpretationResponse.data) {
        // 如果返回了对象中包含data字段
        jobInterpretation.value = interpretationResponse.data;
      } else if (interpretationResponse && interpretationResponse.code === 0) {
        // 如果返回了标准的成功响应格式
        jobInterpretation.value = interpretationResponse.data || interpretationResponse;
      }
    } catch (analyzeErr) {
      console.error('AI解读获取失败:', analyzeErr);
      // 解读失败不影响整体页面
    } finally {
      analyzeLoading.value = false;
    }
  } catch (err) {
    console.error('获取岗位信息失败:', err);
    // 请求失败不影响页面显示（已经有模拟数据）
    error.value = {
      message: err.response?.data?.message || '获取真实数据失败，显示的是模拟数据'
    };
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

/* 新增岗位标题和按钮的布局 */
.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.job-header h2 {
  margin: 0;
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

/* 新增AI解读加载动画样式 */
.analyze-loading {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 16px;
}

.loading-dots {
  display: inline-flex;
  margin-left: 8px;
}

.loading-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #666;
  margin: 0 3px;
  animation: dotAnimation 1.4s infinite ease-in-out both;
}

.loading-dots i:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots i:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dotAnimation {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Markdown内容样式 */
.markdown-content {
  line-height: 1.6;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  margin-top: 16px;
  margin-bottom: 8px;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 20px;
}

.markdown-content :deep(pre) {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #ddd;
  padding-left: 16px;
  color: #666;
  margin-left: 0;
}

.no-interpretation {
  color: #999;
  font-style: italic;
}
</style>