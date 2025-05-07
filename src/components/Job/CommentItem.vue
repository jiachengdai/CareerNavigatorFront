<template>
  <div :class="['comment-item', { 'comment-child': depth > 0 }]">
    <!-- 主题帖显示标题（parentId=0） -->
    <div v-if="comment.parentId === 0" class="title">
      {{ comment.title }}
    </div>

    <!-- 评论基本信息 -->
    <div class="comment-content">
      <div class="user-info">
        <span class="username">{{ comment.userId }}</span>
        <span class="time">{{ comment.createTimeFormatted }}</span>
      </div>
      <p class="content">{{ comment.content }}</p>

      <!-- 操作按钮（仅父评论显示回复，子评论隐藏） -->
      <div class="actions" v-if="depth === 0">
        <button @click="showReplyForm = !showReplyForm">回复</button>
        <button @click="deleteComment(comment.id)">删除</button>
      </div>
    </div>

    <!-- 回复表单（仅对父评论可见） -->
    <CommentForm
        v-if="showReplyForm && depth === 0"
        :parentId="comment.id"
        @refresh="refreshComments"
    />

    <!-- 子评论列表（递归调用） -->
    <div class="children-comments">
      <CommentItem
          v-for="child in comment.children"
          :key="child.id"
          :comment="child"
          :depth="depth + 1"
          @refresh="refreshComments"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import CommentForm from './CommentForm.vue';

const props = {
  comment: { type: Object, required: true },
  depth: { type: Number, default: 0 }
};

const emit = defineEmits(['refresh']);
const showReplyForm = ref(false);

// 删除评论
const deleteComment = async (id) => {
  if (!window.confirm('确定要删除这条评论吗？')) return;
  try {
    await axios.delete(`http://localhost:8080/discussions/delete/${id}`);
    emit('refresh'); // 通知父级刷新
  } catch (error) {
    console.error('删除失败:', error);
  }
};
</script>