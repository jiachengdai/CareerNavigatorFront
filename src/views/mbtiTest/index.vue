<template>
  <div>
    <div class="big-title" style="text-align: center">明晰自我，才能更好决策 🧭</div>

    <div
      style="
        text-align: center;
        margin-bottom: 40px;
        font-size: 22px;
        font-weight: bold;
        color: #333;
      "
    >
      了解自己的性格特征，找到适合自己的职业方向 💼
    </div>
    <div style="font-size: 24px; text-align: left; margin: 20px 60px; font-weight: bold">
      🚀 做测试，发现更多可能 🌟
    </div>
    <div style="margin: 0 60px; display: flex; flex-wrap: wrap; gap: 30px">
      <div class="card">
        <div class="header">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              width: 80px;
              height: 80px;
              background-color: white;
              border-radius: 50%;
              margin: 15px auto;
            "
          >
            <img
              src="https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E8%81%8C%E4%B8%9A%E5%85%B4%E8%B6%A3.svg"
              alt=""
              style="width: 80%; height: 80%; object-fit: cover"
            />
          </div>
        </div>
        <div class="info">
          <p class="title">职业兴趣评测</p>
          <p>
            职业兴趣是职业选择中最重要的因素，是一种强大的精神力量，如果你对某种职业有浓厚的兴趣，你就有更大概率会在这个领域中表现...
          </p>
        </div>
        <div class="footer">
          <p class="tag"></p>
          <button type="button" class="action">开始测评✍️</button>
        </div>
      </div>
      <div class="card">
        <div class="header">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              width: 80px;
              height: 80px;
              background-color: white;
              border-radius: 50%;
              margin: 15px auto;
            "
          >
            <img
              src="https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E6%B6%89%E4%BB%B7%E5%80%BC%E8%A7%82%E7%B1%BB.svg"
              alt=""
              style="width: 80%; height: 80%; object-fit: cover"
            />
          </div>
        </div>
        <div class="info">
          <p class="title">职业价值观测评</p>
          <p>
            职业价值观是指个体对职业的看法和态度，是影响职业选择和发展的重要因素，进行职业价值观测评可以帮助个体了解自己的职业价....
          </p>
        </div>
        <div class="footer">
          <p class="tag"></p>
          <button type="button" class="action">开始测评✍️</button>
        </div>
      </div>
      <div class="card">
        <div class="header">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              width: 80px;
              height: 80px;
              background-color: white;
              border-radius: 50%;
              margin: 15px auto;
            "
          >
            <img
              src="https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E4%B8%93%E5%AE%B6%E8%AF%84%E9%80%89.svg"
              alt=""
              style="width: 80%; height: 80%; object-fit: cover"
            />
          </div>
        </div>
        <div class="info">
          <p class="title">职业气质评测</p>
          <p>
            所谓气质是指一个人天生的性格特征和行为方式，它是个体在生理和心理上所表现出来的稳定的特征。职业气质测评可以帮助个体明确....
          </p>
        </div>
        <div class="footer">
          <p class="tag"></p>
          <button type="button" class="action">开始测评✍️</button>
        </div>
      </div>
      <div class="card">
        <div class="header">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              width: 80px;
              height: 80px;
              background-color: white;
              border-radius: 50%;
              margin: 15px auto;
            "
          >
            <img
              src="https://big-event0713.oss-cn-shanghai.aliyuncs.com/icon-%E5%BF%83%E7%90%86%E6%B5%8B%E8%AF%84-%E6%80%A7%E6%A0%BC.svg"
              alt=""
              style="width: 80%; height: 80%; object-fit: cover"
            />
          </div>
        </div>
        <div class="info">
          <p class="title">职业性格评测</p>
          <p>
            "我性格内向，适合什么工作"，以我的性格特点，适合什么工作？职业性格测评可以帮助个体明确自身性格特征，做出符合自身特质的....
          </p>
        </div>
        <div class="footer">
          <p class="tag"></p>
          <button type="button" class="action">开始测评✍️</button>
        </div>
      </div>
    </div>
    <div
      style="
        font-size: 24px;
        text-align: left;
        margin: 20px 60px;
        font-weight: bold;
        margin-top: 50px;
      "
    >
      🎯 已经有方向，不知道如何努力？
    </div>
    <div style="margin: 0 60px; font-size: 20px; font-weight: bolder">
      定制私人成长计划🫡
      <div style="margin-top: 20px">
        <input
          type="text"
          placeholder="请输入目标岗位"
          style="
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
          "
          v-model="targetPosition"
        />
        <textarea
          placeholder="请输入职位描述"
          style="
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
            resize: none;
          "
          rows="4"
          v-model="jobDescription"
        ></textarea>
        <button
          type="button"
          style="
            width: 100%;
            padding: 10px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            background-color: #2196f3;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          "
          @click="generatePlan"
        >
          点击生成
        </button>
      </div>
      <div
        style="
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
        "
        v-if="
          plan.shortTerm ||
          plan.mediumTerm ||
          plan.longTerm ||
          plan.futureVision ||
          plan.learningPath ||
          plan.riskAnalysis
        "
      >
        <h3
          style="
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
          "
        >
          🌟 成长计划 🌟
        </h3>
        <div style="margin-bottom: 10px">
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px">
            🎯 短期目标:
          </p>
          <p style="font-size: 16px; margin-left: 10px">{{ plan.shortTerm }}</p>
        </div>
        <div style="margin-bottom: 10px">
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px">
            📈 中期目标:
          </p>
          <p style="font-size: 16px; margin-left: 10px">{{ plan.mediumTerm }}</p>
        </div>
        <div style="margin-bottom: 10px">
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px">
            🏆 长期目标:
          </p>
          <p style="font-size: 16px; margin-left: 10px">{{ plan.longTerm }}</p>
        </div>
        <div style="margin-bottom: 10px">
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px">
            🌅 发展前景:
          </p>
          <p style="font-size: 16px; margin-left: 10px">{{ plan.futureVision }}</p>
        </div>
        <div style="margin-bottom: 10px">
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px">
            📚 学习路径:
          </p>
          <p style="font-size: 16px; margin-left: 10px">{{ plan.learningPath }}</p>
        </div>
        <div style="margin-bottom: 10px">
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px">
            ⚠️ 风险分析:
          </p>
          <p style="font-size: 16px; margin-left: 10px">{{ plan.riskAnalysis }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { generatePlanService } from "@/api/careerAnalysis";
const targetPosition = ref("");
const jobDescription = ref("");
const plan = ref({
  shortTerm: "",
  mediumTerm: "",
  longTerm: "",
  futureVision: "",
  learningPath: "",
  riskAnalysis: "",
});
const generatePlan = async () => {
  let result = await generatePlanService(targetPosition.value, jobDescription.value);
  if (result.code == 0) {
    const parsedData = JSON.parse(result.data);
    const formatAsList = (data) =>
      Array.isArray(data) ? data.map((item) => `• ${item}`).join("\n\n") : data;

    plan.value.shortTerm = formatAsList(parsedData.shortTerm);
    plan.value.mediumTerm = formatAsList(parsedData.mediumTerm);
    plan.value.longTerm = formatAsList(parsedData.longTerm);
    plan.value.futureVision = formatAsList(parsedData.futureVision);
    plan.value.learningPath = formatAsList(parsedData.learningPath);
    plan.value.riskAnalysis = formatAsList(parsedData.riskAnalysis);
  } else {
    console.error("Error:", result.message);
  }
};

const title = ref("MBTI Test");
</script>

<style scoped>
.big-title {
  font-weight: bolder;
  font-size: 32px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 0.75rem;
  background-color: white;
  width: 300px;
  height: 370px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.2);
}

.header {
  position: relative;
  background-clip: border-box;
  margin-top: 1.5rem;
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 0.75rem;
  background-color: rgb(33 150 243);
  box-shadow: 0 10px 15px -3px rgba(33, 150, 243, 0.4),
    0 4px 6px -4px rgba(33, 150, 243, 0.4);
  height: 14rem;
}

.info {
  border: none;
  padding: 1.5rem;
  text-align: center;
}

.title {
  color: rgb(38 50 56);
  letter-spacing: 0;
  line-height: 1.375;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.footer {
  padding: 0.75rem;
  border: 1px solid rgb(236 239 241);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 140, 255, 0.082);
}

.tag {
  font-weight: 300;
  font-size: 0.75rem;
  display: block;
}

.action {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  border: none;
  outline: none;
  box-shadow: 0 4px 6px -1px rgba(33, 150, 243, 0.4),
    0 2px 4px -2px rgba(33, 150, 243, 0.4);
  color: rgb(255 255 255);
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.75rem 1.5rem;
  background-color: rgb(33 150 243);
  border-radius: 0.5rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.action:hover {
  background-color: rgb(21 101 192);
  transform: scale(1.05);
  cursor: pointer;
}
</style>
