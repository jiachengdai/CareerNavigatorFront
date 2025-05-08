<template>
  <div class="container">
    <h1 class="title">我的模拟面试记录</h1>
    <div class="scroll-area">
      <div v-if="interviewRecords.length == 0" class="no-records">
        <p class="no-records-text">还没有面试记录哦😶‍🌫️QAQ</p>
        <button class="button outline" @click="toInterview()">
          点击开启新的模拟面试
        </button>
      </div>
      <div class="grid">
        <div v-for="record in interviewRecords" :key="record.id" class="card">
          <div class="card-content">
            <div class="position">{{ record.jobname }}</div>
            <div class="date">面试时间：{{ record.starttime }}</div>
            <div class="score">评分：{{ record.score }}</div>
          </div>
          <div class="actions">
            <button class="button outline" @click="toDetail(record.id)">查看报告</button>
            <button class="button destructive" @click="deleteRecord(record.id)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref,onMounted } from "vue";

const interviewRecords = ref([

]);
import{getAllInterviewService,deleteInterviewService} from '@/api/interview'
const getAll=async()=>{
    let result =await getAllInterviewService();
    console.log(result);
    interviewRecords.value=result.data;
}

const   deleteRecord=async(id)=> {
    let result= await deleteInterviewService(id);
    getAll();
}
onMounted(() => {
    getAll();
})
import { useRouter } from 'vue-router';

const router = useRouter();
const toInterview = () => {
  router.push('/interview/setting');
};
import { useInterviewStore } from '@/store/interview.js';
const interviewStore=useInterviewStore();
const toDetail = (id) => {
    console.log(id);
    interviewStore.setId(id);
  router.push( '/interview/report' );
};
</script>

<style scoped>
.container {
  padding: 24px;

  max-width: 800px;
  margin: 0 auto;
  background-color: #f9fafb; /* 添加背景颜色 */
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 85vh;
  margin-top: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.scroll-area {
  max-height: 550px;
  overflow-y: auto;
  padding-right: 16px;
}

.grid {
  display: grid;
  gap: 16px;
}

.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* 列表项背景颜色 */
  color: #374151; /* 列表项文字颜色 */
  transition: transform 0.2s, box-shadow 0.2s; /* 添加过渡效果 */
}

.card:hover {
  transform: translateY(-4px); /* 鼠标悬浮时向上移动 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* 鼠标悬浮时增加阴影 */
}

.card-content {
  display: flex;
  flex-direction: column;
}

.position {
  font-size: 18px;
  font-weight: 600;
}

.date {
  font-size: 14px;
  color: #6b7280;
}

.score {
  margin-top: 8px;
  font-size: 14px;
  color: #4b5563;
}

.actions {
  display: flex;
  gap: 8px;
}

.button {
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s; /* 添加过渡效果 */
}

.button.outline {
  background-color: #f3f4f6;
  color: #374151;
}

.button.outline:hover {
  background-color: #e5e7eb; /* 鼠标悬浮时改变背景颜色 */
}

.button.destructive {
  background-color: #3b82f6;
  color: #fff;
}

.button.destructive:hover {
  background-color: #2563eb; /* 鼠标悬浮时改变背景颜色 */
  transform: scale(1.05); /* 鼠标悬浮时放大按钮 */
}
.no-records {
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #6b7280;
}
.no-records-text {
  font-size: 20px;
  margin-bottom: 16px;
}
.button {
  padding: 8px 16px;
  font-size: 18px;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 30px;
  transition: background-color 0.2s, transform 0.2s; /* 添加过渡效果 */
}
</style>
