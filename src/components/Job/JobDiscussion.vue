<template>
  <div class="job-discussion">
    <h2>岗位交流讨论区</h2>

    <!-- 发布区域 -->
    <div class="publish-container">
      <h3>{{ isReplying ? '回复评论' : '发布新主题' }}</h3>
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
          <el-input v-model="form.title" />
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

    <!-- 评论列表 -->
    <div class="comment-list">
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
            <span class="author">{{ comment.author }}</span>
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
                @click="handleDelete(comment.id)"
            >
              删除
            </el-button>
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
                <span class="author">{{ child.author }}</span>
                <span class="time">{{ formatTime(child.createTime) }}</span>
                <el-button
                    type="text"
                    class="delete-btn"
                    @click="handleDelete(child.id)"
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
import axios from 'axios'
import dayjs from 'dayjs'

// 表单数据
const form = ref({
  parentId: 0,
  title: '',
  content: ''
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

// 初始化加载
onMounted(async () => {
  await loadComments(0)
})

// 加载评论
const loadComments = async (parentId) => {
  try {
    const res = await axios.get(`/discussions/list/${parentId}`)
    comments.value = res.data.map(item => ({
      ...item,
      createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
    }))
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    const payload = {
      ...form.value,
      parentId: currentParentId.value
    }

    await axios.post('/discussions/publish', payload)

    ElMessage.success(isReplying.value ? '回复成功' : '发布成功')
    resetForm()
    await loadComments(0)
  } catch (error) {
    if (error.response?.data?.code === 1) {
      ElMessage.error(error.response.data.message)
    }
  }
}

// 显示回复表单
const showReplyForm = (parentId) => {
  isReplying.value = true
  currentParentId.value = parentId
  form.value.parentId = parentId
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 删除评论
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该评论？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await axios.delete(`/discussions/delete/${id}`)
    if (res.data.code === 0) {
      ElMessage.success('删除成功')
      await loadComments(0)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
  isReplying.value = false
  currentParentId.value = 0
}

// 时间格式化
const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.job-discussion {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-title {
  color: #1a1a1a;
  font-size: 18px;
  margin-bottom: 10px;
}

.comment-item {
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.sub-comments {
  margin-left: 30px;
  border-left: 2px solid #eee;
  padding-left: 15px;
}

.meta {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.meta .author {
  margin-right: 15px;
}

.delete-btn {
  color: #f56c6c;
}

.comment-content {
  line-height: 1.6;
}
</style>