<template>

  <div class="job-seeker">

    <h1>岗位求职</h1>
    <p>在这里你可以查找岗位、参与交流讨论以及追踪职位申请状态。</p>
    <div class="tabs">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="岗位列表" name="list">
          <JobList />
        </el-tab-pane>
        <el-tab-pane label="交流讨论区" name="discussion">
          <JobDiscussion />
        </el-tab-pane>
        <el-tab-pane label="职位追踪" name="tracking">
          <JobTracking />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import JobList from '../../components/Job/JobList.vue';
import JobDiscussion from '../../components/Job/JobDiscussion.vue';
import JobTracking from '../../components/Job/JobTracking.vue';

const activeTab = ref('list');
</script>

<style scoped>
.job-seeker {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
}

h1 {
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
}

p {
  color: #718096;
  font-size: 1.1rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.tabs {
  margin-top: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

:deep(.el-tabs) {
  --el-color-primary: #3b82f6;
}

:deep(.el-tabs__header) {
  margin: 0;
  background: #f8fafc;
}

:deep(.el-tabs__nav) {
  border: none !important;
}

:deep(.el-tabs__item) {
  padding: 20px 30px !important;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none !important;
  color: #64748b;
}

:deep(.el-tabs__item:hover) {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

:deep(.el-tabs__item.is-active) {
  color: #3b82f6;
  background: white;
  font-weight: 500;
}

:deep(.el-tabs__content) {
  padding: 30px;
}

@media (max-width: 768px) {
  .job-seeker {
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  :deep(.el-tabs__item) {
    padding: 15px 20px !important;
    font-size: 0.9rem;
  }
}
</style>
