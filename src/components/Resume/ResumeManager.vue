<template>
  <div class="resume-manager">
    <h2>简历管理</h2>
    <el-upload
        class="upload-demo"
        drag
        action=""
        :before-upload="handleUpload"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖拽到此处，或<em>点击上传</em></div>
    </el-upload>
    <el-button type="primary" @click="submitAnalysis" :disabled="!resumeFile">提交分析</el-button>
    <div v-if="resumeContent" class="resume-preview">
      <h3>简历预览</h3>
      <div v-html="resumeContent"></div>
    </div>
    <el-table :data="resumes" style="width: 100%">
      <el-table-column prop="fileName" label="文件名"></el-table-column>
      <el-table-column prop="uploadDate" label="上传日期"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="analyzeResume(scope.row.id)">分析</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const resumeFile = ref(null);
const resumeContent = ref(null);
const resumes = ref([]);

const handleUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    resumeContent.value = e.target.result;
  };
  reader.readAsText(file);
  resumeFile.value = file;
  return false;
};

const submitAnalysis = async () => {
  if (!resumeFile.value) return;

  const formData = new FormData();
  formData.append('file', resumeFile.value);

  try {
    const response = await axios.post('/api/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('分析成功！报告已生成。');
    // 上传成功后刷新简历列表
    await fetchResumes();
  } catch (error) {
    console.error('分析失败:', error);
    alert('分析失败，请重试。');
  }
};

const fetchResumes = async () => {
  try {
    const response = await axios.get('/api/resume/list');
    resumes.value = response.data;
  } catch (error) {
    console.error('获取简历列表失败:', error);
  }
};

const analyzeResume = async (resumeId) => {
  try {
    const response = await axios.get(`/api/resume/analysis/${resumeId}`);
    // 这里可以将分析结果展示在弹窗或者新页面中
    console.log('分析结果:', response.data);
    alert('分析结果已获取，请查看控制台。');
  } catch (error) {
    console.error('获取分析结果失败:', error);
    alert('获取分析结果失败，请重试。');
  }
};

onMounted(async () => {
  await fetchResumes();
});
</script>

<style scoped>
.resume-manager {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.resume-preview {
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>