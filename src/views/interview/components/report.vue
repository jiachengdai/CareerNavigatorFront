<template>
  <div>
    <div class="container">
      <!-- 标题 -->
      <div>
        <h1>📝 模拟面试分析报告</h1>
        <p>基于您的模拟面试数据生成的综合评估结果</p>
      </div>

      <!-- 总体评分 -->
      <div>
        <h2>⭐ 面试总结评分</h2>
        <div class="score">{{ detailForm.totalscore }} / 100</div>
        <p v-if="detailForm.totalscore > 90">评价等级：优秀，具备较强岗位胜任力</p>
        <p v-else-if="detailForm.totalscore > 70">评价等级：良好，具备一定岗位胜任力</p>
        <p v-else-if="detailForm.totalscore > 50">评价等级：中等，具备一定基础素质</p>
        <p v-else>评价等级：较差，需加强基础素质能力</p>
      </div>
      <!-- 配置信息概览 -->
      <div>
        <h2>📌 面试配置信息概览</h2>
        <div class="grid" style="font-size: 18px">
          <div>面试类型：{{ detailForm.interviewtype }}</div>
          <div>岗位名称：{{ detailForm.jobname }}</div>
          <div>面试强度：{{ detailForm.intensity }}</div>
          <div>
            上传简历：
            <a :href="detailForm.resume" target="_blank" class="resume-link">点此下载</a>
          </div>
        </div>
      </div>

      <!-- 基础素质能力评分 -->
      <div>
        <h2>🧠 基础素质能力评分</h2>
        <div class="grid" style="grid-template-columns: repeat(3, 1fr)">
          <div>
            表达能力
            <div class="progress-bar">
              <div
                class="progress-bar blue"
                :style="{ width: detailForm.prescore + '%' }"
              ></div>
            </div>
          </div>
          <div>
            沟通逻辑
            <div class="progress-bar">
              <div
                class="progress-bar light-blue"
                :style="{ width: detailForm.logicscore + '%' }"
              ></div>
            </div>
          </div>
          <div>
            应变能力
            <div class="progress-bar">
              <div
                class="progress-bar yellow"
                :style="{ width: detailForm.changescore + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术掌握分析 -->
      <div>
        <h2>💻 技术掌握情况分析</h2>
        <!-- <ul>
          <li>熟悉 Vue3 组件通信及生命周期管理</li>
          <li>掌握基本 JavaScript 异步编程（Promise/async-await）</li>
          <li>对 RESTful API 使用熟练，能完成前后端联调</li>
          <li>算法题思考清晰但表达略有迟疑</li>
        </ul> -->
        <div
          style="font-size: 18px; line-height: 1.5"
          v-html="detailForm.skillssummary.replace(/•/g, '<br>•')"
        ></div>
      </div>

      <!-- 面试能力提升建议 -->
      <div>
        <h2>📈 面试能力提升建议</h2>
        <!-- <ul class="list-decimal">
          <li>加强行为题准备，提升回答的条理性与说服力</li>
          <li>练习口头表达，模拟真实面试场景下的节奏与自信</li>
          <li>刷题建议：LeetCode 中等难度每日一道，强化逻辑训练</li>
        </ul> -->
        <div
          style="font-size: 18px; line-height: 1.5"
          v-html="detailForm.advice.replace(/•/g, '<br>•')"
        ></div>
      </div>

      <!-- 面试交互复盘 -->
      <div>
        <h2>🔁 面试交互过程复盘</h2>
        <div class="review" style="font-size: 18px; line-height: 1.5">
          <div v-for="(chat, index) in chatRecordList" :key="index">
            <p v-if="chat.role == 'assistant'"><strong>面试官:</strong> {{ chat.msg }}</p>
            <p v-else-if="chat.role == 'user'"><strong>用户:</strong> {{ chat.msg }}</p>
            <hr v-if="index < chatRecordList.length - 1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 72rem;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 30px;
}
h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
}
h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}
p {
  color: #6b7280;
  margin-top: 0.5rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  color: #4b5563;
}
.score {
  font-size: 2.25rem;
  font-weight: bold;
  color: #4f46e5;
  margin-top: 0.5rem;
}
.progress-bar {
  width: 100%;
  background-color: #e5e7eb;
  height: 0.75rem;
  border-radius: 0.375rem;
  margin-top: 0.25rem;
  position: relative;
}
.progress-bar div {
  height: 100%;
  border-radius: 0.375rem;
}
.progress-bar.blue {
  background-color: #3b82f6;
}
.progress-bar.light-blue {
  background-color: #60a5fa;
}
.progress-bar.yellow {
  background-color: #facc15;
}
ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  color: #4b5563;
  margin-top: 0.5rem;
}
ul.list-decimal {
  list-style-type: decimal;
}
.review {
  background-color: #f3f4f6;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
}
.review p {
  margin: 0.5rem 0;
}
.review hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0;
}
.resume-link {
  color: #3b82f6;
  text-decoration: none;
}
p {
  font-size: 18px;
}
</style>
<script setup lang="ts">
import { getInterviewDetailService, getInterviewChatService } from "@/api/interview";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useInterviewStore } from "@/store/interview.js";
const interviewStore = useInterviewStore();
const detailForm = ref({
  advice: "",
  skillssummary: "",
});
const chatRecordList = ref([]);
const getDetail = async () => {
  let id = interviewStore.id;
  let result = await getInterviewDetailService(id);
  console.log(result);
  detailForm.value = result.data;
};
onMounted(() => {
  getDetail();
  getInterviewChat();
});

const getInterviewChat = async () => {
  let id = interviewStore.id;

  let result = await getInterviewChatService(id);
  console.log(result);
  chatRecordList.value = result.data;
  console.log(chatRecordList.value);
};
</script>
