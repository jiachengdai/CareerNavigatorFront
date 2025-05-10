<template>
  <div>
    <div class="title" style="text-align: center">Hi ! 欢迎进行AI模拟面试😉~</div>
    <transition name="fade">
      <div v-if="pageCount == 1">
        <div
          style="
            text-align: center;
            margin-bottom: 40px;
            font-size: 22px;
            font-weight: bold;
            color: #333;
          "
        >
          请选择一个岗位类型开始吧 🚀
        </div>
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            justify-items: center;
          "
        >
          <div
            v-for="(job, index) in jobCards"
            :key="index"
            class="job-card"
            style="
              width: 320px;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
              display: flex;
              align-items: center;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              background-color: white;
            "
          >
            <img
              :src="job.logo"
              alt="logo"
              style="width: 80px; height: 80px; margin-right: 20px"
            />
            <div style="flex: 1">
              <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #333">
                {{ job.name }}
              </h3>
              <p style="margin: 10px 0; font-size: 14px; color: #666">
                {{ job.description }}
              </p>
              <el-button type="primary" size="small" @click="selectJobType(job.name)">
                点击进入
              </el-button>
            </div>
          </div>
        </div>
        <div
          style="
            text-align: center;
            margin-top: 40px;

            font-size: 20px;

            color: #666;
          "
        >
          更多岗位，敬请期待😉...
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="pageCount == 2">
        <div
          style="
            text-align: center;
            margin-bottom: 40px;
            font-size: 22px;
            font-weight: bold;
            color: #333;
          "
        >
          请选择你想要的选择面试类型 🎯
        </div>
        <div
          style="
            text-align: left;
            margin-bottom: 20px;

            color: #409eff;
            font-size: 16px;
            margin-left: 200px;
          "
        >
          <span style="cursor: pointer" @click="pageCount = 1">← 返回上一步</span>
        </div>

        <div
          style="
            display: flex;
            justify-content: space-around;
            gap: 30px;
            justify-content: center;
            flex-wrap: wrap;
          "
        >
          <div
            v-for="(item, index) in interviewTypes"
            :key="index"
            class="interview-type-card"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 500px;
              border: 1px solid #ddd;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
              background-color: white;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              text-align: center;
            "
            @click="selectInterviewType(item.name)"
          >
            <img
              :src="item.logo"
              alt="logo"
              style="width: 100px; height: 100px; margin-bottom: 15px"
            />
            <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #333">
              {{ item.name }}
            </h3>
            <p style="margin: 15px 0; font-size: 14px; color: #666">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="pageCount == 3">
        <div
          style="
            text-align: left;
            margin-bottom: 20px;

            color: #409eff;
            font-size: 16px;
            margin-left: 200px;
          "
        >
          <span style="cursor: pointer" @click="pageCount = 2">← 返回上一步</span>
        </div>
        <div style="display: flex; justify-content: center">
          <div class="interview-setting">
            <el-form :model="form" label-width="120px" class="setting-form">
              <el-form-item label="职业类型">
                <el-input v-model="form.jobtype" disabled></el-input>
              </el-form-item>

              <el-form-item label="面试类型">
                <el-input v-model="form.interviewtype" disabled></el-input>
              </el-form-item>
              <el-form-item label="岗位名称">
                <el-input v-model="form.jobname" placeholder="请输入岗位名称"></el-input>
              </el-form-item>
              <el-form-item label="面试强度" style="display: flex; align-items: center">
                <el-slider
                  v-model="form.intensity"
                  :min="1"
                  :max="10"
                  show-stops
                  :format-tooltip="(value) => `${value} ⭐`"
                  style="flex: 1"
                ></el-slider>
                <span style="color: #409eff; margin-left: 10px; white-space: nowrap">
                  {{
                    form.intensity <= 3
                      ? "😌 轻松"
                      : form.intensity <= 7
                      ? "😅 中等"
                      : "🔥 挑战"
                  }}
                </span>
              </el-form-item>

              <el-form-item label="求职岗位JD">
                <el-input
                  type="textarea"
                  v-model="form.jobdescription"
                  placeholder="请输入求职岗位的JD"
                  rows="5"
                  :autosize="false"
                  resize="none"
                ></el-input>
              </el-form-item>

              <el-form-item label="上传个人简历">
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  style="width: 100%"
                />
                <div v-if="selectedFile" style="margin-top: 10px; color: #67c23a">
                  📄 已选择文件：{{ selectedFile.name }}
                </div>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="openConfirmationDialog"
                  >准备好啦！进入面试间</el-button
                >
                <el-button @click="resetForm">重置配置信息</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </transition>

    <!-- 弹窗 -->
    <el-dialog
      title="面试配置信息确认"
      v-model="dialogVisible"
      width="500px"
      @close="closeDialog"
    >
      <div style="margin: 20px 0">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px">
          <span style="color: #409eff; font-weight: bold">职业类型：</span>
          <span>{{ form.jobtype }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px">
          <span style="color: #409eff; font-weight: bold">面试强度：</span>
          <span>{{ "⭐".repeat(form.intensity) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px">
          <span style="color: #409eff; font-weight: bold">面试类型：</span>
          <span>{{ form.interviewtype }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px">
          <span style="color: #409eff; font-weight: bold">求职岗位JD：</span>
          <span>{{ form.jobdescription }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px">
          <span style="color: #409eff; font-weight: bold">简历文件：</span>
          <span>{{ selectedFile?.name || "未上传" }}</span>
        </div>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
        style="padding: 10px 0; display: flex; justify-content: flex-end"
      >
        <el-button type="primary" @click="confirmAndStartInterview">确认并开始</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="js">
import { ref, reactive } from "vue";
import { uploadFileService } from "@/api/upload";
import { ElMessage } from "element-plus";
import router from "../../../router";
const pageCount=ref(1);
const form = reactive({
  id : "",
    jobname: "",
    jobtype: "",
    intensity: 5,
    interviewtype: "",
    jobdescription: "",
    resume: "",
    resumecontent: "",
});

const selectedFile = ref(null);
const fileInput = ref(null);
const dialogVisible = ref(false);

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
};
import {extractResumeService } from "@/api/interview.js";
 const uploadService = async () => {
    if (!selectedFile.value) {
        ElMessage.error("请先选择文件！");
        return;
    }

    try {
        let response = await uploadFileService(selectedFile.value);
        let resumecontent = await extractResumeService(selectedFile.value);
        if (response.code == 0) {
            ElMessage.success("上传简历成功！");
            form.resume = response.data;
            form.resumecontent = resumecontent.data;
        } else {
            ElMessage.error("上传简历失败，请重试！");
        }
    } catch (error) {
        console.error(error);
        ElMessage.error("上传简历过程中发生错误！");
    }
};

const resetForm = () => {
    form.id = "";
    form.jobname = "";

    form.intensity = 0;

    form.jobdescription = "";
    form.resume = "";
    form.resumecontent = "";
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = ""; // 重置文件输入框
    }
};

const openConfirmationDialog = () => {
    if (!form.jobtype || !form.interviewtype.length || !form.jobdescription) {
        ElMessage.error("请完善所有配置项！");
        return;
    }
    dialogVisible.value = true;
};

const closeDialog = () => {
    dialogVisible.value = false;
};
import {useInterviewSettingsStore} from "@/store/interviewSettings.js";
import {newInterviewService} from "@/api/interview";
const interviewSettingsStore = useInterviewSettingsStore();
const confirmAndStartInterview = async () => {
    await uploadService();
    ElMessage.success("配置完成，开始面试！");
    let result= await newInterviewService(form);
    form.id=result.data;
    interviewSettingsStore.setSettings(form);
    router.push("/interview/room");
    dialogVisible.value = false;
};
const selectJobType = (jobType) => {
    form.jobtype = jobType;
    pageCount.value = 2;
};
const selectInterviewType = (type) => {
    form.interviewtype = type;
    pageCount.value = 3;
};
const jobCards = ref([
  {
    name: "软件工程师",
    description: "负责软件开发、测试与维护，参与技术设计与架构。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E4%BB%A3%E7%A0%81-1.svg",
  },
  {
    name: "产品经理",
    description: "负责产品规划与需求分析，协调团队完成产品目标。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E7%BB%8F%E7%90%86.svg",
  },
  {
    name: "数据分析师",
    description: "负责数据收集、清洗与分析，提供数据驱动的决策支持。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90.svg",
  },
  {
    name: "UI/UX设计师",
    description: "负责用户界面设计与用户体验优化，提升产品易用性。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E5%88%9B%E5%BB%BA%E8%AE%BE%E8%AE%A1%E5%8F%98%E6%9B%B4%E8%AE%BE%E8%AE%A1.svg",
  },
  {
    name: "运维工程师",
    description: "负责系统部署、监控与维护，保障系统稳定运行。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E8%BF%90%E7%BB%B4%E7%AE%A1%E7%90%86.svg",
  },
  {
    name: "市场营销专员",
    description: "负责市场推广与品牌宣传，提升产品市场占有率。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E5%B8%82%E5%9C%BA%E8%90%A5%E9%94%80.svg",
  },
  {
    name: "测试工程师",
    description: "负责软件测试与质量保障，确保产品符合需求。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/bug.svg",
  },
  {
    name: "人工智能工程师",
    description: "负责AI模型开发与优化，推动智能化技术应用。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD.svg",
  },
  {
    name: "网络安全工程师",
    description: "负责网络安全防护与漏洞修复，保障系统安全。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8.svg",
  },
  {
    name: "区块链开发工程师",
    description: "负责区块链技术开发与应用，推动去中心化技术落地。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/ZEN%20%E5%8C%BA%E5%9D%97%E9%93%BE.svg",
  },
  {
    name: "云计算工程师",
    description: "负责云平台架构设计与优化，提升云服务性能。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E4%BA%91%E8%AE%A1%E7%AE%97IDC%E4%B8%BB%E6%9C%BA%E6%89%98%E7%AE%A1%E6%9C%8D%E5%8A%A1.svg",
  },
  {
    name: "游戏开发工程师",
    description: "负责游戏设计与开发，打造高质量的游戏体验。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E6%B8%B8%E6%88%8F.svg",
  },
  {
    name: "电子工程师",
    description: "负责电子设备设计与开发，推动硬件技术创新。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E7%AE%97%E5%AD%90-Xgboost_binary.svg",
  },
  {
    name: "技术支持工程师",
    description: "负责技术问题解决与客户支持，提升用户满意度。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E6%8A%80%E6%9C%AF%E6%94%AF%E6%8C%81.svg",
  },
  {
    name: "大数据工程师",
    description: "负责大数据平台搭建与优化，支持海量数据处理。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E5%9F%8E%E5%B8%82%E5%A4%A7%E6%95%B0%E6%8D%AE.svg",
  },
  {
    name:"自动驾驶工程师",
    description:"负责自动驾驶系统开发与测试，推动智能交通技术应用。",
    logo:"https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E8%87%AA%E5%8A%A8%E9%A9%BE%E9%A9%B6.svg",
  }
]);
const interviewTypes = ref([
  {
    name: "基本素养面试",
    description: "价值观、职业规划、择业逻辑以及薪资期望等相关问题。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E6%8A%A5%E5%91%8A%E8%AF%A6%E6%83%85%E8%81%8C%E4%B8%9A%E7%B4%A0%E5%85%BB.svg",
  },
  {
    name: "算法面试",
    description: "考察数据结构与算法能力，解决复杂问题的能力。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E4%BB%A3%E7%A0%81.svg",
  },
  {
    name: "项目面试",
    description: "针对项目经验进行深入探讨，考察技术深度与实践能力。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/%E9%A1%B9%E7%9B%AE%E7%9C%8B%E6%9D%BF-%E5%AE%9E%E6%96%BD%E9%A1%B9%E7%9B%AE.svg",
  },
  {
    name: "业务场景面试",
    description: "模拟真实业务场景，考察问题分析与解决能力。",
    logo: "https://big-event0713.oss-cn-shanghai.aliyuncs.com/icon_%E4%B8%9A%E5%8A%A1%E9%85%8D%E7%BD%AE.svg",
  },
]);
</script>

<style scoped>
.interview-setting {
  padding: 30px;
  padding-top: 50px;
  padding-right: 70px;
  max-width: 600px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.interview-setting:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}
.setting-form {
  max-width: 600px;
  margin: 0 auto;
}
.upload-resume {
  display: block;
}
.title {
  font-weight: bolder;
  font-size: 32px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.job-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.job-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.interview-type-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
