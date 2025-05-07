<template>
  <div class="report-manager">
    <h2>报告管理</h2>
    <el-table :data="reports" style="width: 100%">
      <el-table-column prop="fileName" label="文件名"></el-table-column>
      <el-table-column prop="uploadDate" label="上传日期"></el-table-column>
      <el-table-column prop="score" label="评分"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="viewReport(scope.row)">查看</el-button>
          <el-button type="danger" @click="deleteReport(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const reports = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get('/api/resume/reports');
    reports.value = response.data;
  } catch (error) {
    console.error('获取报告列表失败:', error);
  }
});

const viewReport = (report) => {
  router.push({ name: 'ReportDetail', params: { id: report.id } });
};

const deleteReport = async (report) => {
  try {
    await axios.delete(`/api/resume/reports/${report.id}`);
    reports.value = reports.value.filter(r => r.id !== report.id);
  } catch (error) {
    console.error('删除报告失败:', error);
    alert('删除报告失败，请重试。');
  }
};
</script>

<style scoped>
.report-manager {
  padding: 20px;
}
</style>