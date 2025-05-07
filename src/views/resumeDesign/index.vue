<template>
  <div class="resume-assistant">
    <div class="header">
      <h1>简历助手</h1>
      <p class="subtitle">✨ 您的职业成长伙伴 ✨</p>
    </div>
    <div class="tabs-container">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane label="简历管理" name="manage">
          <ResumeManager />
        </el-tab-pane>
        <el-tab-pane label="简历分析" name="analysis">
          <ResumeAnalysis />
        </el-tab-pane>
        <el-tab-pane label="报告管理" name="reports">
          <ReportManager />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ResumeManager from '../../components/resume/ResumeManager.vue';
import ResumeAnalysis from '../../components/resume/ResumeAnalysis.vue';
import ReportManager from '../../components/resume/ReportManager.vue';

const activeTab = ref('manage');
</script>

<style scoped>
.resume-assistant {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.header h1 {
  color: #3a4b6b;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
  margin-top: 0;
}

.subtitle {
  color: #7c8da7;
  font-size: 18px;
  font-weight: 400;
}

.tabs-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.custom-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 20px;
  border-bottom: none;
}

.custom-tabs :deep(.el-tabs__nav) {
  display: flex;
  justify-content: center;
}

.custom-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  padding: 15px 30px;
  margin: 0 5px;
  border: none;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  color: #3a76f7;
  background-color: #f0f4ff;
  border-bottom: 3px solid #3a76f7;
}

.custom-tabs :deep(.el-tabs__active-bar) {
  display: none;
}

.custom-tabs :deep(.el-tab-pane) {
  padding: 30px;
  border-top: 1px solid #eee;
}
</style>
