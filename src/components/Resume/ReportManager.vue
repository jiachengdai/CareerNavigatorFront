<template>
  <div class="report-manager">
    <h2>评估记录管理</h2>
    
    <!-- 简历选择器 -->
    <div class="resume-selector" v-if="!selectedResumeId">
      <h3>请选择要查看评估记录的简历</h3>
      <el-table :data="resumes" style="width: 100%">
        <el-table-column prop="title" label="简历标题"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间">
          <template #default="scope">
            {{ formatDate(scope.row.createtime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="selectResume(scope.row)">查看记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 评估记录列表 -->
    <div class="assessment-records" v-if="selectedResumeId">
      <div class="header-actions">
        <h3>
          {{ selectedResumeTitle }} 的评估记录
          <el-button type="text" @click="backToResumeList">返回简历列表</el-button>
        </h3>
      </div>
      
      <el-empty v-if="!assessmentRecords.length" description="暂无评估记录"></el-empty>
      
      <el-table v-else :data="assessmentRecords" style="width: 100%">
        <el-table-column prop="createTime" label="评估时间">
          <template #default="scope">
            {{ formatDate(scope.row.assessmentTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分">
          <template #default="scope">
            {{ getAssessmentScore(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="viewRecord(scope.row)">查看详情</el-button>
            <el-button size="small" type="danger" @click="confirmDeleteRecord(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 评估记录详情对话框 -->
    <el-dialog title="评估记录详情" v-model="recordDialogVisible" width="70%">
      <div v-if="currentRecord" class="record-detail">
        <p><strong>评估时间：</strong>{{ formatDate(currentRecord.assessmentTime) }}</p>
        <p><strong>评分：</strong>{{ getAssessmentScore(currentRecord) }}</p>
        
        <div v-if="getAssessmentAnalysis(currentRecord)" class="analysis-section">
          <h4>分析结果</h4>
          <div class="analysis-content">{{ getAssessmentAnalysis(currentRecord) }}</div>
        </div>
        
        <div v-if="getAssessmentSuggestions(currentRecord).length" class="advice-section">
          <h4>改进建议</h4>
          <div class="advice-content">
            <ul>
              <li v-for="(suggestion, index) in getAssessmentSuggestions(currentRecord)" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getResumeListByUserService } from '@/api/resume';
import { getResumeAssessmentRecordsService, deleteResumeAssessmentRecordService } from '@/api/resumeAssessment';
import { useAccountInfoStore } from '@/store/account';

// 获取用户信息
const accountStore = useAccountInfoStore();

// 简历列表
const resumes = ref([]);
const selectedResumeId = ref(null);
const selectedResumeTitle = ref('');

// 评估记录
const assessmentRecords = ref([]);
const currentRecord = ref(null);
const recordDialogVisible = ref(false);

// 格式化日期函数
const formatDate = (dateStr) => {
  if (!dateStr) return '暂无';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // 如果转换失败，返回原字符串
    
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch (e) {
    return dateStr;
  }
};

// 获取简历类型标签
const getTypeLabel = (type) => {
  const typeMap = {
    'campus': '校园招聘',
    'social': '社会招聘',
    'intern': '实习招聘'
  };
  return typeMap[type] || type;
};

// 获取标签类型
const getTypeTagType = (type) => {
  const typeTagMap = {
    'campus': 'success',
    'social': 'primary',
    'intern': 'warning'
  };
  return typeTagMap[type] || '';
};

// 解析评估结果JSON
const parseAssessmentResult = (record) => {
  if (!record || !record.assessmentResult) return null;
  
  try {
    const resultObj = JSON.parse(record.assessmentResult);
    if (resultObj && resultObj.choices && resultObj.choices.length > 0) {
      const content = resultObj.choices[0].message.content;
      // 提取JSON字符串并解析
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
    }
    return null;
  } catch (error) {
    console.error('解析评估结果失败:', error);
    return null;
  }
};

// 获取评分
const getAssessmentScore = (record) => {
  const result = parseAssessmentResult(record);
  return result ? result.score : '暂无';
};

// 获取分析结果
const getAssessmentAnalysis = (record) => {
  const result = parseAssessmentResult(record);
  return result ? result.analysis : '';
};

// 获取建议
const getAssessmentSuggestions = (record) => {
  const result = parseAssessmentResult(record);
  return result && result.suggestions ? result.suggestions : [];
};

// 获取简历列表
const fetchResumes = async () => {
  try {
    const username = accountStore.info?.username || 'guest';
    const response = await getResumeListByUserService(username);
    
    if (response && response.data) {
      resumes.value = response.data;
    } else if (response && response.code === 0 && response.data) {
      resumes.value = response.data;
    } else {
      resumes.value = [];
    }
  } catch (error) {
    console.error('获取简历列表失败:', error);
    ElMessage.error('获取简历列表失败，请重试');
  }
};

// 选择简历
const selectResume = async (resume) => {
  selectedResumeId.value = resume.id;
  selectedResumeTitle.value = resume.title;
  await fetchAssessmentRecords(resume.id);
};

// 返回简历列表
const backToResumeList = () => {
  selectedResumeId.value = null;
  selectedResumeTitle.value = '';
  assessmentRecords.value = [];
};

// 获取评估记录
const fetchAssessmentRecords = async (resumeId) => {
  try {
    const response = await getResumeAssessmentRecordsService(resumeId);
    
    if (response && response.data) {
      assessmentRecords.value = response.data;
    } else if (response && response.code === 0 && response.data) {
      assessmentRecords.value = response.data;
    } else {
      // 处理无数据情况，包括code为1且message为"无评估记录"的情况
      assessmentRecords.value = [];
      if (response && response.code === 1 && response.message === "无评估记录") {
        // 这是正常的无数据情况，不需要显示错误提示
        console.log("该简历暂无评估记录");
      } else {
        // 其他异常情况
        ElMessage.warning('未获取到评估记录数据');
      }
    }
  } catch (error) {
    console.error('获取评估记录失败:', error);
    ElMessage.error('获取评估记录失败，请重试');
    assessmentRecords.value = [];
  }
};

// 查看评估记录详情
const viewRecord = (record) => {
  currentRecord.value = record;
  recordDialogVisible.value = true;
};

// 确认删除评估记录
const confirmDeleteRecord = (record) => {
  ElMessageBox.confirm('确定要删除这条评估记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteRecord(record.id);
  }).catch(() => {
    // 用户取消删除
  });
};

// 删除评估记录
const deleteRecord = async (recordId) => {
  try {
    await deleteResumeAssessmentRecordService(recordId);
    ElMessage.success('删除成功');
    
    // 刷新评估记录列表
    if (selectedResumeId.value) {
      await fetchAssessmentRecords(selectedResumeId.value);
    }
  } catch (error) {
    console.error('删除评估记录失败:', error);
    ElMessage.error('删除评估记录失败，请重试');
  }
};

// 组件挂载时获取简历列表
onMounted(async () => {
  await fetchResumes();
});
</script>

<style scoped>
.report-manager {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.resume-selector, .assessment-records {
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.record-detail {
  margin-top: 20px;
  line-height: 1.8;
}

.analysis-content, .advice-content {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 20px;
  white-space: pre-line;
}

.analysis-section, .advice-section {
  margin-top: 20px;
}

.advice-content ul {
  padding-left: 20px;
}

.advice-content li {
  margin-bottom: 10px;
  line-height: 1.6;
}

h3 {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

h4 {
  margin-top: 15px;
  margin-bottom: 5px;
  color: #409EFF;
}
</style>