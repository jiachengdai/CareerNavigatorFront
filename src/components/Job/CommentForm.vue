<template>
  <div class="reply-form">
    <form @submit.prevent="handleSubmit">
      <!-- 主题帖需要标题（parentId=0且needTitle为true） -->
      <div v-if="needTitle">
        <label>标题：</label>
        <input v-model="title" required />
      </div>

      <label>内容：</label>
      <textarea v-model="content" required rows="3"></textarea>

      <button type="submit">发布</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = {
  parentId: { type: Number, required: true },
  needTitle: { type: Boolean, default: false } // 是否需要标题（主题帖为true）
};

const emit = defineEmits(['refresh']);
const title = ref('');
const content = ref('');

const handleSubmit = async () => {
  if (!content.value.trim()) return;

  const formData = {
    parentId: props.parentId,
    content: content.value.trim(),
    // 主题帖需要标题（parentId=0时）
    ...(props.needTitle ? {title: title.value.trim(), parentId: 0} : {})
  };

  try {
    await axios.post('http://localhost:8080/discussions/publish', formData, {
      headers: {'Content-Type': 'application/json'}
    });
    title.value = '';
    content.value = '';
    emit('refresh'); // 通知刷新评论
  } catch (error) {
    console.error('发布失败:', error.response?.data?.message || '网络错误');
  }
};
</script>