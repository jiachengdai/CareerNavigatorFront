<template>
  <div class="job-details-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">⏳ 加载中...</div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">❌ 加载失败：{{ error.message }}</div>

    <!-- 岗位详情内容 -->
    <div v-if="!isLoading && !error" class="job-details">
      <div class="job-header">
        <h2>📌 {{ jobDetails.jobname }}</h2>
        <!-- 添加投递简历按钮 -->
        <el-button type="primary" @click="applyJob">📤 投递简历</el-button>
      </div>

      <!-- 基本信息卡片 -->
      <div class="info-card">
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">🏢 公司：</span>
            <span class="info-value">{{ jobDetails.company }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">💰 薪资：</span>
            <span class="info-value">{{ formatSalary(jobDetails.salary) }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item">
            <span class="info-label">📍 工作地点：</span>
            <span class="info-value">{{ jobDetails.location }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🛠️ 工作经验：</span>
            <span class="info-value">{{ jobDetails.experience || "不限" }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item">
            <span class="info-label">🎓 学历要求：</span>
            <span class="info-value">{{ jobDetails.education || "不限" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">📋 岗位类型：</span>
            <span class="info-value">{{ jobDetails.jobtype }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item full-width">
            <span class="info-label">🗓️ 发布时间：</span>
            <span class="info-value">{{ formatDate(jobDetails.publishdate) }}</span>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="content-section">
        <!-- 左侧内容 -->
        <div class="main-content">
          <!-- 岗位描述和要求 -->
          <div class="job-description-card">
            <h3>📄 岗位描述</h3>
            <div class="description-content">
              <pre>{{ jobDetails.jobdescription }}</pre>
            </div>
          </div>

          <div class="job-requirements-card">
            <h3>📋 岗位要求</h3>
            <div class="requirements-content">
              <pre>{{ jobDetails.requirement }}</pre>
            </div>
          </div>

          <!-- 评论区域 -->
          <div class="comments-card">
            <h3>💬 评论区</h3>

            <!-- 评论输入框 -->
            <div class="comment-form" v-if="accountStore.info?.username">
              <el-input
                v-model="commentContent"
                type="textarea"
                :rows="3"
                placeholder="分享你对这个职位的看法... ✍️"
                maxlength="500"
                show-word-limit
              ></el-input>
              <div class="form-actions">
                <el-button
                  type="primary"
                  @click="submitComment"
                  :loading="submittingComment"
                  >📢 发表评论</el-button
                >
              </div>
            </div>
            <div v-else class="login-tip">
              请<el-button type="text" @click="goToLogin">登录</el-button>后发表评论 😊
            </div>

            <!-- 评论列表 -->
            <div class="comments-list">
              <div v-if="commentsLoading" class="comments-loading">⏳ 加载评论中...</div>
              <el-empty v-else-if="!comments.length" description="暂无评论 😔"></el-empty>
              <div v-else>
                <div
                  v-for="comment in topLevelComments"
                  :key="comment.id"
                  class="comment-item"
                >
                  <div class="comment-header">
                    <span class="comment-user">👤 {{ comment.userId }}</span>
                    <span class="comment-time"
                      >🕒 {{ formatDate(comment.createTime) }}</span
                    >
                    <el-button
                      v-if="comment.userId === accountStore.info?.username"
                      type="text"
                      class="delete-btn"
                      @click="deleteComment(comment.id)"
                      >🗑️ 删除</el-button
                    >
                  </div>
                  <div class="comment-content">{{ comment.content }}</div>

                  <!-- 回复按钮 -->
                  <div class="comment-actions">
                    <el-button type="text" @click="showReplyForm(comment.id)"
                      >💬 回复</el-button
                    >
                  </div>

                  <!-- 回复输入框 -->
                  <div v-if="replyToCommentId === comment.id" class="reply-form">
                    <el-input
                      v-model="replyContent"
                      type="textarea"
                      :rows="2"
                      placeholder="回复评论... ✍️"
                      maxlength="500"
                      show-word-limit
                    ></el-input>
                    <div class="form-actions">
                      <el-button @click="cancelReply">取消</el-button>
                      <el-button
                        type="primary"
                        @click="submitReply(comment.id)"
                        :loading="submittingComment"
                        >📢 回复</el-button
                      >
                    </div>
                  </div>

                  <!-- 子评论列表 -->
                  <div
                    v-if="getChildComments(comment.id).length > 0"
                    class="child-comments"
                  >
                    <div
                      v-for="childComment in getChildComments(comment.id)"
                      :key="childComment.id"
                      class="child-comment-item"
                    >
                      <div class="comment-header">
                        <span class="comment-user">👤 {{ childComment.userId }}</span>
                        <span class="comment-time"
                          >🕒 {{ formatDate(childComment.createTime) }}</span
                        >
                        <el-button
                          v-if="childComment.userId === accountStore.info?.username"
                          type="text"
                          class="delete-btn"
                          @click="deleteComment(childComment.id)"
                          >🗑️ 删除</el-button
                        >
                      </div>
                      <div class="comment-content">{{ childComment.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="side-content">
          <!-- 岗位匹配 -->
          <div v-if="jobMatching !== null" class="matching-card">
            <h3>🎯 你的匹配度</h3>
            <div class="matching-content">
              <div class="matching-value">
                {{ Math.min(Math.max(jobMatching, 0), 100) }}%
              </div>
            </div>
          </div>

          <!-- 岗位解读 -->
          <div class="interpretation-card">
            <h3>🤖 AI岗位解读</h3>
            <!-- AI解读加载中状态 -->
            <div v-if="analyzeLoading" class="analyze-loading">
              <span>AI解读中</span>
              <span class="loading-dots"> <i></i><i></i><i></i> </span>
            </div>
            <!-- AI解读内容 -->
            <div v-else-if="jobInterpretation" class="interpretation-content">
              <div
                v-html="renderMarkdown(jobInterpretation)"
                class="markdown-content"
              ></div>
            </div>
            <div v-else class="no-interpretation">暂无岗位解读 🤔</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 投递成功/失败提示对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" center>
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
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getJobByIdService, analyzeJobService } from "@/api/job";
import { createJobApplyService } from "@/api/jobApply";
import { useAccountInfoStore } from "@/store/account";
import { marked } from "marked";
import {
  getJobDiscussionsService,
  publishJobDiscussionService,
  deleteDiscussionService,
} from "@/api/discussion";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const router = useRouter();
const jobDetails = ref({});
const jobInterpretation = ref(null);
const jobMatching = ref(null);
const isLoading = ref(true);
const error = ref(null);
// 新增AI解读加载状态
const analyzeLoading = ref(false);
// 投递对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMessage = ref("");
// 账户信息
const accountStore = useAccountInfoStore();

// 评论相关
const comments = ref([]);
const commentContent = ref("");
const commentsLoading = ref(false);
const submittingComment = ref(false);
const replyToCommentId = ref(null); // 新增：当前回复的评论ID
const replyContent = ref(""); // 新增：回复内容

// 计算顶级评论
const topLevelComments = computed(() => {
  return comments.value.filter((comment) => comment.parentId === 0);
});

// 获取子评论
const getChildComments = (parentId) => {
  return comments.value.filter((comment) => comment.parentId === parentId);
};

// 显示回复表单
const showReplyForm = (commentId) => {
  // 检查用户是否登录
  if (!accountStore.info?.username) {
    ElMessage.warning("请先登录后再回复评论");
    return;
  }
  replyToCommentId.value = commentId;
  replyContent.value = "";
};

// 取消回复
const cancelReply = () => {
  replyToCommentId.value = null;
  replyContent.value = "";
};

// 提交回复
const submitReply = async (parentId) => {
  if (!accountStore.info?.username) {
    ElMessage.warning("请先登录后再回复评论");
    return;
  }

  if (!replyContent.value.trim()) {
    ElMessage.warning("回复内容不能为空");
    return;
  }

  submittingComment.value = true;
  try {
    const replyData = {
      userId: accountStore.info.username,
      content: replyContent.value.trim(),
      parentId: parentId,
      jobId: parseInt(route.params.id),
    };

    await publishJobDiscussionService(replyData, route.params.id);
    ElMessage.success("回复发表成功");
    replyContent.value = ""; // 清空输入框
    replyToCommentId.value = null; // 隐藏回复框
    await fetchComments(); // 重新加载评论列表
  } catch (err) {
    console.error("发表回复失败:", err);
    ElMessage.error("发表回复失败，请稍后重试");
  } finally {
    submittingComment.value = false;
  }
};

// 格式化薪资显示
const formatSalary = (salary) => {
  if (!salary) return "面议";
  return `${salary} 元/月`;
};

// 格式化日期显示
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN");
};

// 渲染Markdown为HTML
const renderMarkdown = (content) => {
  if (!content) return "";
  return marked(content);
};

// 跳转到登录页
const goToLogin = () => {
  router.push("/login");
};

// 获取评论列表
const fetchComments = async () => {
  if (!route.params.id) return;

  commentsLoading.value = true;
  try {
    const response = await getJobDiscussionsService(route.params.id);
    if (response && response.data) {
      comments.value = response.data;
    } else if (response && response.code === 0 && response.data) {
      comments.value = response.data;
    } else {
      comments.value = [];
    }
  } catch (err) {
    console.error("获取评论失败:", err);
    ElMessage.error("获取评论失败，请稍后重试");
    comments.value = [];
  } finally {
    commentsLoading.value = false;
  }
};

// 提交评论
const submitComment = async () => {
  if (!accountStore.info?.username) {
    ElMessage.warning("请先登录后再发表评论");
    return;
  }

  if (!commentContent.value.trim()) {
    ElMessage.warning("评论内容不能为空");
    return;
  }

  submittingComment.value = true;
  try {
    const commentData = {
      userId: accountStore.info.username,
      content: commentContent.value.trim(),
      parentId: 0, // 顶级评论
      jobId: parseInt(route.params.id),
    };

    await publishJobDiscussionService(commentData, route.params.id);
    ElMessage.success("评论发表成功");
    commentContent.value = ""; // 清空输入框
    await fetchComments(); // 重新加载评论列表
  } catch (err) {
    console.error("发表评论失败:", err);
    ElMessage.error("发表评论失败，请稍后重试");
  } finally {
    submittingComment.value = false;
  }
};

// 删除评论
const deleteComment = async (commentId) => {
  ElMessageBox.confirm("确定要删除这条评论吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteDiscussionService(commentId);
        ElMessage.success("评论已删除");
        await fetchComments(); // 重新加载评论列表
      } catch (err) {
        console.error("删除评论失败:", err);
        ElMessage.error("删除评论失败，请稍后重试");
      }
    })
    .catch(() => {
      // 用户取消删除操作
    });
};

// 投递简历函数
const applyJob = async () => {
  // 检查用户是否登录
  if (!accountStore.info || !accountStore.info.username) {
    dialogTitle.value = "投递失败";
    dialogMessage.value = "请先登录后再投递简历";
    dialogVisible.value = true;
    return;
  }

  try {
    // 准备投递数据
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")} ${String(
      currentDate.getHours()
    ).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}:${String(
      currentDate.getSeconds()
    ).padStart(2, "0")}`;

    const jobApplyData = {
      username: accountStore.info.username,
      jobid: jobDetails.value.id,
      applydate: formattedDate,
      status: "已投递", // 修改为已投递状态
    };

    // 调用API投递简历
    const response = await createJobApplyService(jobApplyData);

    // 投递成功提示
    dialogTitle.value = "投递成功";
    dialogMessage.value = `您已成功投递"${jobDetails.value.jobname}"职位的简历，请等待企业回复`;
    dialogVisible.value = true;
  } catch (err) {
    console.error("投递简历失败:", err);
    // 投递失败提示
    dialogTitle.value = "投递失败";
    dialogMessage.value = err.response?.data?.message || "投递简历失败，请稍后重试";
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
  jobdescription:
    "负责公司产品的前端开发，包括但不限于Web应用、移动端适配等。使用Vue.js、React等前端框架。",
  requirement:
    "1. 熟悉HTML、CSS、JavaScript\n2. 熟练掌握Vue.js或React\n3. 了解前端工程化和常用构建工具",
  publishdate: "2023-05-15",
};

onMounted(async () => {
  // 立即显示模拟数据，确保UI不再显示加载中
  jobDetails.value = mockJobData;
  isLoading.value = false;

  try {
    // 后台请求真实数据
    const detailsResponse = await getJobByIdService(route.params.id);
    console.log("岗位详情响应:", detailsResponse);

    // 如果成功获取到数据则替换模拟数据
    if (detailsResponse && detailsResponse.data) {
      jobDetails.value = detailsResponse.data;
    } else if (detailsResponse && detailsResponse.code === 0) {
      jobDetails.value = detailsResponse.data || detailsResponse;
    }

    // 并行请求评论列表，不再等待AI解读完成
    fetchComments();

    // 获取AI岗位解读（单独处理，显示加载状态）
    analyzeLoading.value = true;
    try {
      const interpretationResponse = await analyzeJobService(route.params.id);
      console.log("岗位解读响应:", interpretationResponse);

      if (interpretationResponse && typeof interpretationResponse === "string") {
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
      console.error("AI解读获取失败:", analyzeErr);
      // 解读失败不影响整体页面
    } finally {
      analyzeLoading.value = false;
    }
  } catch (err) {
    console.error("获取岗位信息失败:", err);
    // 请求失败不影响页面显示（已经有模拟数据）
    error.value = {
      message: err.response?.data?.message || "获取真实数据失败，显示的是模拟数据",
    };

    // 即使获取岗位信息失败，也尝试获取评论
    fetchComments();
  }
});
</script>

<style scoped>
/* 整体容器样式 */
.job-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
}

/* 加载和错误状态 */
.loading,
.error {
  padding: 30px;
  text-align: center;
  font-size: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.error {
  color: #ff4444;
}

/* 岗位详情整体样式 */
.job-details {
  background-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

/* 岗位标题和按钮的布局 */
.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.job-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

/* 基本信息卡片 */
.info-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.info-row {
  display: flex;
  margin-bottom: 15px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  flex: 1;
  display: flex;
  align-items: baseline;
}

.info-item.full-width {
  flex: 2;
}

.info-label {
  font-weight: bold;
  color: #606266;
  margin-right: 10px;
  min-width: 80px;
}

.info-value {
  color: #303133;
}

/* 主要内容区域 */
.content-section {
  display: flex;
  gap: 16px;
}

/* 左侧主要内容 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 右侧内容 */
.side-content {
  width: 400px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 卡片通用样式 */
.job-description-card,
.job-requirements-card,
.comments-card,
.matching-card,
.interpretation-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 卡片标题样式 */
.job-description-card h3,
.job-requirements-card h3,
.comments-card h3,
.matching-card h3,
.interpretation-card h3 {
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 12px;
  font-size: 18px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
}

/* 岗位描述和要求内容 */
.description-content,
.requirements-content {
  color: #606266;
}

.description-content pre,
.requirements-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin: 0;
  font-family: inherit;
  line-height: 1.6;
}

/* 匹配度样式 */
.matching-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.matching-value {
  font-size: 36px;
  font-weight: bold;
  color: #67c23a;
}

/* AI解读内容 */
.interpretation-content {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.interpretation-content::-webkit-scrollbar {
  width: 6px;
}

.interpretation-content::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 3px;
}

.interpretation-content::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

/* Markdown内容样式 */
.markdown-content {
  line-height: 1.7;
  color: #303133;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  margin-top: 16px;
  margin-bottom: 10px;
  color: #303133;
}

.markdown-content :deep(p) {
  margin-bottom: 12px;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 20px;
  margin-bottom: 12px;
}

.markdown-content :deep(li) {
  margin-bottom: 6px;
}

.markdown-content :deep(pre) {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 12px;
}

.markdown-content :deep(code) {
  background-color: #f0f2f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: Consolas, Monaco, "Andale Mono", monospace;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #dcdfe6;
  padding-left: 16px;
  color: #606266;
  margin: 0 0 12px;
}

.no-interpretation {
  color: #909399;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

/* AI解读加载动画样式 */
.analyze-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 16px;
  padding: 30px 0;
}

.loading-dots {
  display: inline-flex;
  margin-left: 8px;
}

.loading-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #909399;
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
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 评论区样式 */
.comment-form {
  margin-bottom: 20px;
}

.form-actions {
  margin-top: 10px;
  text-align: right;
}

.login-tip {
  text-align: center;
  color: #909399;
  margin-bottom: 20px;
  padding: 15px 0;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.comments-loading {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}

.comment-item {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: bold;
  color: #303133;
}

.comment-time {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.delete-btn {
  margin-left: auto;
  color: #f56c6c;
}

.comment-content {
  line-height: 1.6;
  color: #606266;
}

/* 评论操作区 */
.comment-actions {
  margin-top: 8px;
}

/* 回复表单 */
.reply-form {
  margin: 10px 0 10px 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 子评论样式 */
.child-comments {
  margin-left: 20px;
  margin-top: 10px;
  padding-left: 10px;
  border-left: 2px solid #ebeef5;
}

.child-comment-item {
  padding: 10px;
  background-color: #f9fafc;
  border-radius: 4px;
  margin-bottom: 8px;
}

.child-comment-item:last-child {
  margin-bottom: 0;
}

/* 响应式布局 */
@media (max-width: 1100px) {
  .content-section {
    flex-direction: column;
  }

  .side-content {
    width: 100%;
    order: -1; /* 在移动端将侧边栏放在上面 */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .matching-card,
  .interpretation-card {
    flex: 1;
    min-width: 300px;
  }

  .interpretation-content {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .info-row {
    flex-direction: column;
  }

  .info-item {
    margin-bottom: 10px;
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  .side-content {
    flex-direction: column;
  }

  .matching-card,
  .interpretation-card {
    width: 100%;
  }
}
</style>
