<template>
  <div class="resume-manager">
    <!-- 简历列表 -->
    <div class="resume-list">
      <h3>我的简历</h3>
      <el-table :data="resumes" style="width: 100%; min-height: 30vh; font-size: 15px">
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">{{
              getTypeLabel(scope.row.type)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间">
          <template #default="scope">
            {{ formatDate(scope.row.createtime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button size="small" @click="viewResume(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="analyzeResume(scope.row.id)"
              >AI简历评估</el-button
            >
            <el-button size="small" type="danger" @click="deleteResume(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 简历详情对话框 -->
    <el-dialog title="简历详情" v-model="dialogVisible" width="70%">
      <h3>{{ currentResume.title }}</h3>
      <div class="resume-detail">
        <p><strong>类型：</strong>{{ getTypeLabel(currentResume.type) }}</p>
        <p><strong>创建时间：</strong>{{ formatDate(currentResume.createtime) }}</p>

        <!-- 分析结果 -->
        <div v-if="currentResume.analysis" class="analysis-section">
          <h4>分析结果</h4>
          <div class="analysis-content">{{ currentResume.analysis }}</div>
        </div>

        <!-- 改进建议 -->
        <div v-if="currentResume.advice" class="advice-section">
          <h4>改进建议</h4>
          <div class="advice-content">
            <ul>
              <li v-for="(suggestion, index) in adviceSuggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 简历内容 -->
        <h4>简历内容</h4>
        <div class="resume-content">{{ currentResume.content }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
// 导入resume.js中的API函数
import {
  createResumeService,
  assessResumeService,
  getResumeByIdService,
  getResumeListByUserService,
  deleteResumeService,
} from "@/api/resume";
import { getAssessmentService } from "@/api/resumeAssessment";
// 导入账户信息store
import { useAccountInfoStore } from "@/store/account";
import { ElMessage } from "element-plus";

// 获取用户信息
const accountStore = useAccountInfoStore();

// 简历表单
const resumeFormRef = ref(null);
const resumeForm = reactive({
  title: "",
  type: "",
  content: "",
});

// 表单验证规则
const rules = {
  title: [
    { required: true, message: "请输入简历标题", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
  ],
  type: [{ required: true, message: "请选择简历类型", trigger: "change" }],
  content: [{ required: true, message: "请输入简历内容", trigger: "blur" }],
};

// 简历列表
const resumes = ref([]);

// 简历详情对话框
const dialogVisible = ref(false);
const currentResume = ref({});

// 格式化日期函数
const formatDate = (dateStr) => {
  if (!dateStr) return "暂无";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // 如果转换失败，返回原字符串

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}`;
  } catch (e) {
    return dateStr;
  }
};

// 生成当前日期时间字符串
const getCurrentDateTime = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
};

// 保存简历
const submitResume = async () => {
  if (!accountStore.info?.username) {
    ElMessage.warning("请先登录");
    return;
  }

  try {
    await resumeFormRef.value.validate();

    // 使用getCurrentDateTime函数获取当前时间
    const createtime = getCurrentDateTime();

    const resumeData = {
      ...resumeForm,
      username: accountStore.info.username,
      createtime: createtime, // 添加创建时间
    };

    await createResumeService(resumeData);
    ElMessage.success("简历保存成功");

    // 重置表单
    resumeFormRef.value.resetFields();

    // 刷新简历列表
    await fetchResumes();
  } catch (error) {
    console.error("保存简历失败:", error);
    ElMessage.error("保存简历失败，请重试");
  }
};

// 提交简历分析
const submitAnalysis = async () => {
  if (!accountStore.info?.username) {
    ElMessage.warning("请先登录");
    return;
  }

  try {
    await resumeFormRef.value.validate();

    ElMessage.info("正在分析简历，请稍候...");
    // 只传递简历内容给assessResumeService接口
    const analysisResponse = await assessResumeService(resumeForm.content);

    // 解析分析结果
    const parsedResult = parseAnalysisResult(analysisResponse);
    if (parsedResult) {
      // 创建包含分析结果的简历数据
      const resumeData = {
        ...resumeForm,
        username: accountStore.info.username,
        createtime: getCurrentDateTime(),
        score: parsedResult.score,
        analysis: parsedResult.analysis,
        advice: Array.isArray(parsedResult.suggestions)
          ? parsedResult.suggestions.join("\n\n")
          : parsedResult.suggestions,
      };

      // 保存简历
      await createResumeService(resumeData);

      ElMessage.success("分析完成并保存");

      // 重置表单
      resumeFormRef.value.resetFields();

      // 刷新简历列表
      await fetchResumes();
    } else {
      ElMessage.warning("解析分析结果失败");
    }
  } catch (error) {
    console.error("分析失败:", error);
    ElMessage.error("分析失败，请重试");
  }
};

// 获取简历列表
const fetchResumes = async () => {
  try {
    // 从accountStore获取用户名
    const username = accountStore.info?.username || "guest";
    const response = await getResumeListByUserService(username);

    // 确保我们从正确的位置获取数据
    if (response && response.data) {
      resumes.value = response.data;
    } else if (response && response.code === 0 && response.data) {
      resumes.value = response.data;
    } else {
      resumes.value = [];
    }
  } catch (error) {
    console.error("获取简历列表失败:", error);
    ElMessage.error("获取简历列表失败，请重试");
    resumes.value = [];
  }
};

// 查看简历详情
const viewResume = (resume) => {
  currentResume.value = resume;
  dialogVisible.value = true;
};

// 分析简历
const analyzeResume = async (resumeId) => {
  try {
    // 先获取简历详情
    const detailResponse = await getResumeByIdService(resumeId);
    ElMessage.info("正在分析简历，请稍候...");
    const analysisResponse = await getAssessmentService(resumeId);
  } catch (e) {
    console.error("简历分析失败:", e);
    ElMessage.error("简历分析失败，请重试");
  }
};

// 删除简历
const deleteResume = async (resumeId) => {
  try {
    await deleteResumeService(resumeId);
    ElMessage.success("删除成功");
    // 刷新简历列表
    await fetchResumes();
  } catch (error) {
    console.error("删除简历失败:", error);
    ElMessage.error("删除简历失败，请重试");
  }
};

// 获取简历类型标签
const getTypeLabel = (type) => {
  const typeMap = {
    campus: "校园招聘",
    social: "社会招聘",
    intern: "实习招聘",
  };
  return typeMap[type] || type;
};

// 获取标签类型
const getTypeTagType = (type) => {
  const typeTagMap = {
    campus: "success",
    social: "primary",
    intern: "warning",
  };
  return typeTagMap[type] || "";
};

// 解析分析结果
const parseAnalysisResult = (analysisData) => {
  if (!analysisData) return null;

  try {
    // 尝试解析第一层JSON字符串
    let parsedData =
      typeof analysisData === "string" ? JSON.parse(analysisData) : analysisData;

    // 检查是否有data字段，并且是字符串
    if (parsedData.data && typeof parsedData.data === "string") {
      // 尝试解析第二层JSON字符串
      const innerData = JSON.parse(parsedData.data);

      // 检查是否有choices字段
      if (innerData.choices && innerData.choices.length > 0) {
        const content = innerData.choices[0].message.content;

        // 提取JSON部分（去除markdown标记）
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          // 解析最终的JSON结果
          const finalResult = JSON.parse(jsonMatch[1]);
          return finalResult;
        }
      }

      return innerData; // 如果没有找到预期的结构，返回内部数据
    }

    return parsedData; // 如果没有data字段或不是字符串，返回第一层解析结果
  } catch (error) {
    console.error("解析分析结果失败:", error);
    return null;
  }
};

// 计算属性：评分值（转换为el-rate组件需要的数值）
const scoreValue = computed(() => {
  if (!currentResume.value || !currentResume.value.score) return 0;
  // 将100分制转换为5分制
  return Math.round(currentResume.value.score / 20);
});

// 计算属性：建议列表
const adviceSuggestions = computed(() => {
  if (!currentResume.value || !currentResume.value.advice) return [];

  // 如果建议是字符串，尝试按换行符分割
  if (typeof currentResume.value.advice === "string") {
    return currentResume.value.advice.split(/\n+/).filter((item) => item.trim());
  }

  // 如果已经是数组，直接返回
  if (Array.isArray(currentResume.value.advice)) {
    return currentResume.value.advice;
  }

  return [];
});

onMounted(async () => {
  await fetchResumes();
});
</script>

<style scoped>
.resume-manager {
  padding: 20px;
  /* background-color: #f5f5f5; */
  border-radius: 8px;
  padding-top: 0px;
}

.resume-form,
.resume-list {
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.resume-detail {
  margin-top: 20px;
  line-height: 1.8;
}

.analysis-content,
.advice-content,
.resume-content {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 20px;
  white-space: pre-line;
}

.analysis-section,
.advice-section {
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
  color: #409eff;
}
</style>
