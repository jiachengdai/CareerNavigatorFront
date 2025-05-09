<template>
  <div class="job-discussion">
    <h2>岗位交流讨论区</h2>

    <!-- 发布区域 -->
    <div class="publish-container">
      <h3>{{ isReplying ? getReplyInfo(currentParentId) : '发布新主题' }}</h3>
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          @submit.prevent="handleSubmit"
      >
        <!-- 仅主题帖显示标题输入 -->
        <el-form-item
            v-if="!isReplying"
            prop="title"
            label="主题标题"
        >
          <el-input v-model="form.title" placeholder="请输入标题..." />
        </el-form-item>

        <el-form-item prop="content" label="内容">
          <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="请输入内容..."
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">
            {{ isReplying ? '提交回复' : '发布主题' }}
          </el-button>
          <el-button v-if="isReplying" @click="cancelReply">取消回复</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 加载中状态 -->
    <div v-if="isLoading" class="loading">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 评论列表 -->
    <div v-else class="comment-list">
      <div v-if="comments.length === 0" class="no-data">
        暂无讨论主题，成为第一个发言的人吧！
      </div>
      <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
      >
        <!-- 主题帖标题 -->
        <h3 v-if="comment.parentId === 0" class="post-title">
          {{ comment.title }}
        </h3>

        <!-- 评论内容 -->
        <div class="comment-content">
          {{ comment.content }}
          <div class="meta">
            <span class="author">{{ comment.userId }}</span>
            <span class="time">{{ formatTime(comment.createTime) }}</span>
            <el-button
                type="text"
                @click="showReplyForm(comment.id)"
            >
              回复
            </el-button>
            <el-button
                type="text"
                class="delete-btn"
                v-if="accountStore.info && accountStore.info.username === comment.userId"
                @click="handleDelete(comment.id, comment.userId)"
            >
              删除
            </el-button>
            
            <!-- 回复数量提示 -->
            <div v-if="comment.children?.length" class="reply-count">
              共 {{ comment.children.length }} 条回复
            </div>
          </div>
        </div>

        <!-- 子评论 -->
        <div
            v-if="comment.children?.length"
            class="sub-comments"
        >
          <div
              v-for="child in comment.children"
              :key="child.id"
              class="sub-comment"
          >
            <div class="comment-content">
              {{ child.content }}
              <div class="meta">
                <span class="author">{{ child.userId }}</span>
                <span class="time">{{ formatTime(child.createTime) }}</span>
                <el-button
                    type="text"
                    @click="showReplyForm(comment.id)"
                >
                  回复
                </el-button>
                <el-button
                    type="text"
                    class="delete-btn"
                    v-if="accountStore.info && accountStore.info.username === child.userId"
                    @click="handleDelete(child.id, child.userId)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { publishDiscussionService, getDiscussionsService, deleteDiscussionService } from '@/api/discussion'
import { useAccountInfoStore } from '@/store/account'

// 获取用户信息
const accountStore = useAccountInfoStore();

// 表单数据
const form = ref({
  parentId: 0,
  title: '',
  content: '',
  username: accountStore.info?.username || ''
})
const formRef = ref()
const isReplying = ref(false)
const currentParentId = ref(0)

// 验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 50, message: '标题不超过50字', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { max: 500, message: '内容不超过500字', trigger: 'blur' }
  ]
}

// 评论数据
const comments = ref([])
// 加载状态
const isLoading = ref(false)

// 初始化加载
onMounted(async () => {
  await loadComments(0)
})

// 加载评论
const loadComments = async (parentId) => {
  isLoading.value = true;
  try {
    const response = await getDiscussionsService(parentId);
    
    // 检查并处理返回数据
    let discussionData = [];
    if (response && response.data) {
      discussionData = response.data;
    } else if (response && response.code === 0 && response.data) {
      discussionData = response.data;
    }
    
    // 处理主题帖和回复关系
    if (parentId === 0) {
      // 加载主题帖
      const mainPosts = discussionData.filter(item => item.parentId === 0);
      
      // 为每个主题帖添加子评论属性
      comments.value = await Promise.all(mainPosts.map(async post => {
        // 加载每个主题帖的回复
        try {
          const repliesResponse = await getDiscussionsService(post.id);
          let replies = [];
          
          if (repliesResponse && repliesResponse.data) {
            replies = repliesResponse.data;
          } else if (repliesResponse && repliesResponse.code === 0 && repliesResponse.data) {
            replies = repliesResponse.data;
          }
          
          // 格式化时间
          replies = replies.map(reply => ({
            ...reply,
            createTime: dayjs(reply.createTime).format('YYYY-MM-DD HH:mm')
          }));
          
          return {
            ...post,
            createTime: dayjs(post.createTime).format('YYYY-MM-DD HH:mm'),
            children: replies
          };
        } catch (err) {
          console.error(`获取评论回复失败(ID:${post.id}):`, err);
          return {
            ...post,
            createTime: dayjs(post.createTime).format('YYYY-MM-DD HH:mm'),
            children: []
          };
        }
      }));
    } else {
      // 如果是加载特定主题的回复，直接返回
      comments.value = discussionData.map(item => ({
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
      }));
    }
  } catch (error) {
    console.error('加载评论失败:', error);
    ElMessage.error('加载评论失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
}

// 回复相关信息显示
const getReplyInfo = (parentId) => {
  // 查找被回复的评论
  const findComment = (comments, id) => {
    for (const comment of comments) {
      if (comment.id === id) return comment;
      if (comment.children) {
        const found = findComment(comment.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  const parentComment = findComment(comments.value, parentId);
  return parentComment ? `回复 ${parentComment.userId} 的评论` : '回复评论';
};

// 提交表单
const handleSubmit = async () => {
  // 检查用户是否登录
  if (!accountStore.info || !accountStore.info.username) {
    ElMessage.warning('请先登录后再发布评论');
    return;
  }
  
  try {
    await formRef.value.validate();
    
    // 确保表单中包含userId（使用username的值）
    form.value.userId = accountStore.info.username;
    
    const payload = {
      ...form.value,
      parentId: currentParentId.value
    };

    const response = await publishDiscussionService(payload);
    
    if (response && (response.code === 0 || response.data)) {
      ElMessage.success(isReplying.value ? '回复成功' : '发布成功');
      resetForm();
      await loadComments(0);
    } else {
      ElMessage.error(response?.message || '发布失败，请稍后重试');
    }
  } catch (error) {
    console.error('发布评论失败:', error);
    ElMessage.error(error.response?.data?.message || '发布失败，请稍后重试');
  }
}

// 显示回复表单
const showReplyForm = (parentId) => {
  // 检查用户是否登录
  if (!accountStore.info || !accountStore.info.username) {
    ElMessage.warning('请先登录后再回复评论');
    return;
  }
  
  isReplying.value = true;
  currentParentId.value = parentId;
  form.value.parentId = parentId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 取消回复
const cancelReply = () => {
  resetForm();
}

// 删除评论
const handleDelete = async (id, commentUserId) => {
  // 检查用户是否登录
  if (!accountStore.info || !accountStore.info.username) {
    ElMessage.warning('请先登录后再删除评论');
    return;
  }
  
  // 检查是否有权限删除（是否为评论作者）
  const currentUserId = accountStore.info.username;
  if (commentUserId !== currentUserId) {
    ElMessage.warning('只能删除自己发布的评论');
    return;
  }
  
  try {
    await ElMessageBox.confirm('确认删除该评论？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const response = await deleteDiscussionService(id);
    
    if (response && (response.code === 0 || response.data)) {
      ElMessage.success('删除成功');
      await loadComments(0);
    } else {
      ElMessage.error(response?.message || '删除失败，请稍后重试');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error);
      ElMessage.error(error.response?.data?.message || '删除失败，请稍后重试');
    }
  }
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
  isReplying.value = false;
  currentParentId.value = 0;
}

// 时间格式化
const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
}
</script>

<style scoped>
.job-discussion {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.no-data {
  padding: 40px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.post-title {
  color: #1a1a1a;
  font-size: 20px;
  margin-bottom: 15px;
  border-left: 4px solid #409eff;
  padding-left: 10px;
  line-height: 1.4;
}

.comment-item {
  margin-bottom: 25px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #f0f0f0;
}

.comment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.sub-comments {
  margin-left: 30px;
  border-left: 3px solid #e6f1fc;
  padding-left: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
  background-color: #f9fafc;
  padding: 15px 15px 5px 20px;
  border-radius: 0 8px 8px 0;
}

.sub-comment {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e8e8e8;
}

.sub-comment:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.meta {
  margin-top: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.meta .author {
  color: #409eff;
  font-weight: bold;
  font-size: 13px;
}

.meta .time {
  color: #909399;
  font-size: 12px;
}

.meta .el-button {
  padding: 4px 8px;
  height: auto;
  font-size: 12px;
}

.delete-btn {
  color: #f56c6c;
}

.comment-content {
  line-height: 1.8;
  color: #303133;
  word-break: break-word;
}

.publish-container {
  margin-bottom: 35px;
  padding: 25px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  border: 1px solid #e6e6e6;
}

.publish-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.reply-count {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
  text-align: right;
  background-color: #f5f7fa;
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  margin-left: auto;
}

.job-discussion h2 {
  margin-bottom: 25px;
  color: #303133;
  text-align: center;
  position: relative;
}

.job-discussion h2:after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #409eff;
  margin: 10px auto 0;
}
</style>