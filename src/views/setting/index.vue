<template>
  <div class="job-seeker">
    <div class="title" style="text-align: center">开启你的求职之旅 🚀</div>
    <div
      style="
        text-align: center;
        margin-bottom: 40px;
        font-size: 22px;
        font-weight: bold;
        color: #333;
      "
    >
      找到属于你的梦想岗位 🌟
    </div>
    <div class="tabs">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="岗位列表" name="list">
          <JobList />
        </el-tab-pane>
        <el-tab-pane label="投递追踪" name="tracking">
          <JobTracking />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import JobList from "../../components/Job/JobList.vue";
import JobTracking from "../../components/Job/JobTracking.vue";

const activeTab = ref("list");
</script>

<style scoped>
.job-seeker {
  max-width: 1200px;
  margin: 0 auto;
  /* background: #f8fafc; */
  min-height: 100vh;
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
.title {
  font-weight: bolder;
  font-size: 32px;
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
