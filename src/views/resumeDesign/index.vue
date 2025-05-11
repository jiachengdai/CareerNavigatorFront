<template>
  <div class="resume-assistant">
    <div class="header">
      <h1 class="title">准备求职？先打造一份优秀的简历吧！✍️</h1>

      <div class="subtitle" @click="router.push('/template')">
        点击这里立刻创建新的简历😁
      </div>
    </div>

    <div class="tabs-container">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane label="我的简历🗒️" name="manage">
          <ResumeManager />
        </el-tab-pane>
        <el-tab-pane label="报告查询📒" name="reports">
          <ReportManager />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ResumeManager from "../../components/Resume/ResumeManager.vue";
import ReportManager from "../../components/Resume/ReportManager.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const activeTab = ref("manage");
</script>

<style scoped>
.resume-assistant {
  max-width: 1200px;
  margin: 0 auto;
  /* background-color: #f8f9fa; */
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  text-align: center;

  border-bottom: 1px solid #eee;
}

.subtitle {
  text-align: center;
  margin-bottom: 40px;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  display: inline-block;
}
.subtitle:hover {
  color: #3a76f7;
}
.tabs-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  max-height: 90vh;
  min-height: 65vh;
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
.newResume {
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
  font-weight: bolder;
  cursor: pointer;
}
.title {
  font-weight: bolder;
  font-size: 32px;
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
