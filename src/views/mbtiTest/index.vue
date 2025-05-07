<template>
  <div class="mbti-test-container" :class="{ 'dark-mode': settingsStore.isDark }">
    <a-card title="MBTI 职业性格测评" :bordered="false" :class="{ 'dark-mode': settingsStore.isDark }">
      <template v-if="currentStep === 'intro'">
        <div class="intro-section">
          <h2>什么是MBTI测试？</h2>
          <p>MBTI (Myers-Briggs Type Indicator) 是一种性格分类工具，可以帮助你了解自己的性格特点和职业倾向。</p>
          <p>测试包含90个问题，大约需要15-20分钟完成。请根据你的第一感觉回答，没有对错之分。</p>
          
          <h3>测试将从四个维度评估你的性格特点：</h3>
          <ul>
            <li><b>E(外向) - I(内向)</b>：你从哪里获取能量</li>
            <li><b>S(实感) - N(直觉)</b>：你如何获取信息</li>
            <li><b>T(思考) - F(情感)</b>：你如何做决定</li>
            <li><b>J(判断) - P(感知)</b>：你如何处理外部世界</li>
          </ul>
          
          <div class="action-buttons">
            <a-button type="primary" size="large" @click="startTest">开始测试</a-button>
          </div>
          
          <!-- 历史记录部分 -->
          <div class="history-section" v-if="historyRecords.length > 0">
            <h3>您的历史测试记录</h3>
            <a-table 
              :dataSource="historyRecords" 
              :columns="historyColumns"
              :pagination="{ pageSize: 5 }"
              rowKey="id"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'actions'">
                  <a-space>
                    <a @click="viewHistoryDetail(record)">查看详情</a>
                    <a-popconfirm
                      title="确定要删除这条记录吗？"
                      @confirm="deleteRecord(record.id)"
                      ok-text="确定"
                      cancel-text="取消"
                    >
                      <a class="delete-link">删除</a>
                    </a-popconfirm>
                  </a-space>
                </template>
              </template>
            </a-table>
          </div>
          
          <div class="loading-container" v-if="loading">
            <a-spin tip="加载历史记录中..."></a-spin>
          </div>
        </div>
      </template>
      
      <template v-else-if="currentStep === 'questions'">
        <div class="questions-section" v-if="questions.length > 0">
          <div class="progress-info">
            <a-progress :percent="progressPercent" :stroke-color="{ from: '#108ee9', to: '#87d068' }" />
            <span>{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          </div>
          
          <div class="question-card">
            <h3 class="question-text">{{ currentQuestion.questionText }}</h3>
            <div class="options">
              <a-radio-group v-model:value="answers[currentQuestion.id]" button-style="solid" size="large">
                <a-radio-button value="是">是</a-radio-button>
                <a-radio-button value="否">否</a-radio-button>
              </a-radio-group>
            </div>
          </div>
          
          <div class="navigation-buttons">
            <a-button 
              @click="prevQuestion" 
              :disabled="currentQuestionIndex === 0"
            >上一题</a-button>
            <a-button 
              type="primary" 
              @click="nextQuestion"
              :disabled="!answers[currentQuestion.id]"
            >
              {{ currentQuestionIndex === questions.length - 1 ? '提交' : '下一题' }}
            </a-button>
          </div>
        </div>
        
        <div v-else class="loading">
          <a-spin tip="加载题目中..."></a-spin>
        </div>
      </template>
      
      <template v-else-if="currentStep === 'result'">
        <div class="result-section" v-if="result">
          <h2>测试结果</h2>
          
          <div class="result-type">
            <h1>{{ result.mbtiType }}</h1>
            <p class="type-description">
              {{ getMbtiTypeDescription(result.mbtiType) }}
            </p>
          </div>
          
          <div class="result-details">
            <h3>维度得分</h3>
            <div class="dimension-scores">
              <div class="dimension">
                <div class="dimension-labels">
                  <span>内向 (I)</span>
                  <span>外向 (E)</span>
                </div>
                <a-progress 
                  :percent="(result.iScore / (result.iScore + result.eScore)) * 100" 
                  :format="() => `${result.iScore}:${result.eScore}`"
                  status="active"
                />
              </div>
              
              <div class="dimension">
                <div class="dimension-labels">
                  <span>实感 (S)</span>
                  <span>直觉 (N)</span>
                </div>
                <a-progress 
                  :percent="(result.sScore / (result.sScore + result.nScore)) * 100" 
                  :format="() => `${result.sScore}:${result.nScore}`"
                  status="active"
                />
              </div>
              
              <div class="dimension">
                <div class="dimension-labels">
                  <span>思考 (T)</span>
                  <span>情感 (F)</span>
                </div>
                <a-progress 
                  :percent="(result.tScore / (result.tScore + result.fScore)) * 100" 
                  :format="() => `${result.tScore}:${result.fScore}`"
                  status="active"
                />
              </div>
              
              <div class="dimension">
                <div class="dimension-labels">
                  <span>判断 (J)</span>
                  <span>感知 (P)</span>
                </div>
                <a-progress 
                  :percent="(result.jScore / (result.jScore + result.pScore)) * 100" 
                  :format="() => `${result.jScore}:${result.pScore}`"
                  status="active"
                />
              </div>
            </div>
          </div>
          
          <div class="career-recommendations">
            <h3>职业推荐</h3>
            <p>基于你的MBTI类型，以下职业可能适合你：</p>
            <ul>
              <li v-for="(job, index) in getRecommendedJobs(result.mbtiType)" :key="index">
                {{ job }}
              </li>
            </ul>
          </div>
          
          <div class="action-buttons">
            <a-button type="primary" @click="restartTest">重新测试</a-button>
            <a-button style="margin-left: 16px" @click="viewHistory">查看历史结果</a-button>
          </div>
        </div>

        <div v-else class="loading">
          <a-spin tip="加载结果中..."></a-spin>
        </div>
      </template>
      
      <template v-else-if="currentStep === 'history'">
        <div class="history-section">
          <h2>测试历史记录</h2>
          
          <a-table 
            :dataSource="historyRecords" 
            :columns="historyColumns"
            :pagination="{ pageSize: 5 }"
            rowKey="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'actions'">
                <a-space>
                  <a @click="viewHistoryDetail(record)">查看</a>
                  <a-popconfirm
                    title="确定要删除这条记录吗？"
                    @confirm="deleteRecord(record.id)"
                    ok-text="确定"
                    cancel-text="取消"
                  >
                    <a class="delete-link">删除</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
          
          <div class="action-buttons" style="margin-top: 20px">
            <a-button type="primary" @click="restartTest">开始新测试</a-button>
            <a-button style="margin-left: 16px" @click="currentStep = 'intro'">返回</a-button>
          </div>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useAccountInfoStore } from '@/store/account';
import { useSettingsStore } from '@/store/useSettingsStore';
import { 
  getMbtiQuestionsService, 
  submitMbtiAnswersService, 
  getMbtiRecordsService,
  deleteMbtiRecordService,
  type MbtiQuestion,
  type MbtiResult,
  type MbtiAnswers 
} from '@/api/mbti';

// 状态管理
const accountStore = useAccountInfoStore();
const settingsStore = useSettingsStore();
const currentStep = ref<'intro' | 'questions' | 'result' | 'history'>('intro');
const questions = ref<MbtiQuestion[]>([]);
const currentQuestionIndex = ref(0);
const answers = reactive<MbtiAnswers>({});
const result = ref<MbtiResult | null>(null);
const historyRecords = ref<MbtiResult[]>([]);
const loading = ref(false);

// 计算属性
const currentQuestion = computed(() => {
  if (questions.value.length === 0) return { id: 0, questionText: '', dimension: '', sort: 0, status: 0 };
  return questions.value[currentQuestionIndex.value] || questions.value[0];
});

const progressPercent = computed(() => {
  return Math.floor(((currentQuestionIndex.value + 1) / questions.value.length) * 100);
});

const hasHistory = computed(() => {
  return historyRecords.value.length > 0;
});

// 历史记录表格列定义
const historyColumns = [
  {
    title: 'MBTI类型',
    dataIndex: 'mbtiType',
    key: 'mbtiType',
  },
  {
    title: '测试时间',
    dataIndex: 'testTime',
    key: 'testTime',
    customRender: ({ text }: { text: string }) => {
      return new Date(text).toLocaleString('zh-CN');
    }
  },
  {
    title: '操作',
    key: 'actions',
  }
];

// 方法
const fetchQuestions = async () => {
  loading.value = true;
  try {
    const res = await getMbtiQuestionsService();
    if (res.code === 0) {
      questions.value = res.data.sort((a, b) => a.sort - b.sort);
    } else {
      message.error(res.message || '获取问题失败');
    }
  } catch (error) {
    console.error('获取问题错误:', error);
    message.error('获取问题失败');
  } finally {
    loading.value = false;
  }
};

const fetchHistory = async () => {
  if (!accountStore.info?.username) return;
  
  loading.value = true;
  try {
    const res = await getMbtiRecordsService(accountStore.info.username);
    if (res.code === 0) {
      historyRecords.value = res.data;
    } else {
      message.error(res.message || '获取历史记录失败');
    }
  } catch (error) {
    console.error('获取历史记录错误:', error);
    message.error('获取历史记录失败');
  } finally {
    loading.value = false;
  }
};

const startTest = async () => {
  await fetchQuestions();
  if (questions.value.length > 0) {
    // 清空上次答案
    for (const key in answers) {
      delete answers[key];
    }
    currentQuestionIndex.value = 0;
    currentStep.value = 'questions';
  }
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  } else {
    submitTest();
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const submitTest = async () => {
  if (!accountStore.info?.username) {
    message.error('用户未登录');
    return;
  }
  
  loading.value = true;
  try {
    const res = await submitMbtiAnswersService(accountStore.info.username, answers);
    if (res.code === 0) {
      result.value = res.data;
      currentStep.value = 'result';
      // 刷新历史记录
      await fetchHistory();
    } else {
      message.error(res.message || '提交测试失败');
    }
  } catch (error) {
    console.error('提交测试错误:', error);
    message.error('提交测试失败');
  } finally {
    loading.value = false;
  }
};

const restartTest = () => {
  currentStep.value = 'intro';
};

const viewHistory = async () => {
  await fetchHistory();
  currentStep.value = 'history';
};

const viewHistoryDetail = (record: MbtiResult) => {
  result.value = record;
  currentStep.value = 'result';
};

const deleteRecord = async (id: number) => {
  loading.value = true;
  try {
    const res = await deleteMbtiRecordService(id);
    if (res.code === 0) {
      message.success('删除成功');
      await fetchHistory();
    } else {
      message.error(res.message || '删除失败');
    }
  } catch (error) {
    console.error('删除记录错误:', error);
    message.error('删除记录失败');
  } finally {
    loading.value = false;
  }
};

const getMbtiTypeDescription = (mbtiType: string) => {
  const descriptions: Record<string, string> = {
    'ISTJ': '安静、严肃，通过全面性和可靠性获得成功。实际、注重事实、负责任。能够合乎逻辑地决定应该采取的行动，并坚定不移地朝着目标前进。',
    'ISFJ': '安静、友好、负责任和有良心。致力于履行义务。彻底、勤勉、准确。忠诚、体贴，关注他人的情感。',
    'INFJ': '寻求意义和联系，想要理解什么能激励人。具有洞察力且致力于自己的价值观。对于如何最好地服务公众利益有清晰的远见。',
    'INTJ': '独立思考，对自己和他人都有很高的要求。使用原创思想和强烈的目标驱动来实现目标。能够快速洞察外部事件的模式。',
    'ISTP': '容忍度大且灵活，安静地观察直到问题出现，然后迅速行动找到可行的解决方案。分析事物如何运作，并能找出大量事实。',
    'ISFP': '安静、友好、敏感和善良。享受当下，热爱自己的空间和按自己的时间表工作。忠于自己的价值观和对他们重要的人。',
    'INFP': '理想主义者，忠于自己的价值观和对他们重要的人。寻求外部生活与内在价值观的一致性。好奇，善于发现可能性。',
    'INTP': '寻求提供对感兴趣事物的逻辑解释。理论性强，对抽象思想比人际交往更感兴趣。安静、内敛、灵活且适应性强。',
    'ESTP': '灵活、容忍，采用务实的方法专注于即时结果。对理论和概念阐述感到厌烦。喜欢活跃地解决问题，尤其是与人相关的问题。',
    'ESFP': '外向、友好、接受力强。热爱生活、人和物质享受。善于与他人一起工作使事情发生。带来常识和现实态度。',
    'ENFP': '热情洋溢、充满想象力。能够找到为几乎任何事情做任何事情的可能性。能够快速找到与信息的联系并自信地根据联系行动。',
    'ENTP': '机敏、善于创新，充满活力，善于寻找解决新问题的概念解决方案。善于产生概念可能性并以分析方式分析它们。',
    'ESTJ': '务实、现实、注重事实，决断力强。专注于最有效的方式组织人员和活动以获得结果。关注按照程序正确完成任务。',
    'ESFJ': '热心肠、有责任感、合作。希望与他人和谐相处，他们与周围的人一起工作以忠实地完成任务。',
    'ENFJ': '热情、体贴、敏感。有优越的沟通能力，喜欢帮助他人充分发挥潜力。能够成为小组的催化剂和发起者。',
    'ENTJ': '坦率、果断，承担领导责任。快速看到不合逻辑和低效的程序和政策，制定和实施全面的系统来解决组织问题。'
  };
  
  return descriptions[mbtiType] || '暂无描述';
};

const getRecommendedJobs = (mbtiType: string) => {
  const jobRecommendations: Record<string, string[]> = {
    'ISTJ': ['会计师', '工程师', '审计师', '税务专家', '军人', '警察', '法官'],
    'ISFJ': ['护士', '小学教师', '图书管理员', '客户服务代表', '行政助理', '医疗技术人员'],
    'INFJ': ['心理咨询师', '教师', '作家', '心理学家', 'HR专家', '社会工作者'],
    'INTJ': ['科学家', '工程师', '法官', '系统分析师', '计算机程序员', '管理顾问'],
    'ISTP': ['工程师', '技师', '飞行员', '经济学家', '法医调查员', '系统分析师'],
    'ISFP': ['艺术家', '音乐家', '摄影师', '设计师', '护士', '初级教育工作者'],
    'INFP': ['作家', '艺术家', '心理咨询师', '社会工作者', '教师', '音乐家'],
    'INTP': ['科学家', '摄影师', '程序员', '系统分析师', '大学教授', '建筑师'],
    'ESTP': ['企业家', '营销人员', '销售代表', '投资顾问', '运动员', '消防员'],
    'ESFP': ['艺人', '销售代表', '活动策划师', '公关专员', '旅游指导', '儿童保育员'],
    'ENFP': ['记者', '营销顾问', '广告创意', '演员', '教练', '企业家'],
    'ENTP': ['企业家', '律师', '发明家', '市场分析师', '创意总监', '政治家'],
    'ESTJ': ['项目经理', '学校校长', '生产主管', '销售经理', '高管', '警官'],
    'ESFJ': ['销售代表', '医疗保健工作者', '社会工作者', '公关专员', '办公室经理', '教师'],
    'ENFJ': ['教师', '咨询师', '人力资源专家', '销售培训师', '营销人员', '政府工作者'],
    'ENTJ': ['企业高管', '律师', '管理顾问', '政治家', '大学教授', '科技企业家']
  };
  
  return jobRecommendations[mbtiType] || ['暂无推荐职业'];
};

// 生命周期钩子
onMounted(async () => {
  // 页面加载时立即获取历史记录
  await fetchHistory();
});
</script>

<style scoped>
.mbti-test-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.intro-section, .questions-section, .result-section, .history-section {
  padding: 20px 0;
}

.intro-section h2, .result-section h2, .history-section h2, .history-section h3 {
  text-align: center;
  margin-bottom: 20px;
}

.intro-section ul {
  margin: 15px 0;
  padding-left: 20px;
}

.intro-section li {
  margin-bottom: 10px;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
}

.progress-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.progress-info span {
  margin-left: 10px;
  font-weight: bold;
}

.question-card {
  background-color: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-text {
  font-size: 18px;
  margin-bottom: 25px;
}

.options {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.result-type {
  text-align: center;
  margin-bottom: 30px;
}

.result-type h1 {
  font-size: 48px;
  margin-bottom: 10px;
  color: #1890ff;
}

.type-description {
  text-align: justify;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 700px;
}

.result-details, .career-recommendations {
  margin: 30px 0;
}

.dimension-scores {
  margin-top: 15px;
}

.dimension {
  margin-bottom: 20px;
}

.dimension-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-weight: bold;
}

.career-recommendations ul {
  margin-top: 10px;
  padding-left: 20px;
}

.career-recommendations li {
  margin-bottom: 5px;
}

.delete-link {
  color: #ff4d4f;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.history-section {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 30px;
}

/* 暗黑模式样式 */
.dark-mode :deep(.ant-card) {
  background-color: #1E1E2E;
  color: #cdd6f4;
  border-color: #313244;
}

.dark-mode :deep(.ant-card-head) {
  background-color: #313244;
  color: #cdd6f4;
  border-color: #45475a;
}

.dark-mode :deep(.ant-input),
.dark-mode :deep(.ant-input-password .ant-input),
.dark-mode :deep(.ant-input-number-input) {
  background-color: #2c2e3b;
  border-color: #45475a;
  color: #fff;
}

.dark-mode :deep(.ant-input-affix-wrapper),
.dark-mode :deep(.ant-input-password),
.dark-mode :deep(.ant-input-number),
.dark-mode :deep(.ant-picker) {
  background-color: #2c2e3b;
  border-color: #45475a;
}

.dark-mode :deep(.ant-select-selector) {
  background-color: #2c2e3b !important;
  border-color: #45475a !important;
  color: #fff !important;
}

.dark-mode :deep(.ant-select-selection-placeholder),
.dark-mode :deep(.ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dark-mode :deep(.ant-select-arrow) {
  color: #9c87fe;
}

.dark-mode :deep(.ant-btn-primary) {
  background-color: #9c87fe;
  border-color: #9c87fe;
}

.dark-mode :deep(.ant-table) {
  background-color: #1E1E2E;
  color: #cdd6f4;
}

.dark-mode :deep(.ant-table-thead > tr > th) {
  background-color: #313244;
  color: #cdd6f4;
  border-color: #45475a;
}

.dark-mode :deep(.ant-table-tbody > tr > td) {
  border-color: #45475a;
  color: #cdd6f4;
}

.dark-mode :deep(.ant-table-tbody > tr) {
  background-color: #1E1E2E;
}

.dark-mode :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #313244 !important;
}

.dark-mode :deep(.ant-pagination-item) {
  background-color: #2c2e3b;
  border-color: #45475a;
}

.dark-mode :deep(.ant-pagination-item a) {
  color: #cdd6f4;
}

.dark-mode :deep(.ant-pagination-item-active) {
  border-color: #9c87fe;
}

.dark-mode :deep(.ant-pagination-item-active a) {
  color: #9c87fe;
}

.dark-mode :deep(.ant-tag) {
  background: #3a3a3c;
  border-color: #3a3a3c;
  color: #d8d8d8;
}

.dark-mode :deep(.ant-radio-button-wrapper) {
  background-color: #2c2e3b;
  border-color: #45475a;
  color: #cdd6f4;
}

.dark-mode :deep(.ant-radio-button-wrapper-checked) {
  background-color: #9c87fe;
  border-color: #9c87fe;
  color: #fff;
}

.dark-mode :deep(.ant-progress-text) {
  color: #cdd6f4;
}

.dark-mode .question-card {
  background-color: #313244;
  color: #cdd6f4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .result-type h1 {
  color: #9c87fe;
}

.dark-mode a {
  color: #9c87fe;
}

.dark-mode .delete-link {
  color: #ff4d4f;
}

.dark-mode .history-section {
  border-top-color: #45475a;
}
</style> 