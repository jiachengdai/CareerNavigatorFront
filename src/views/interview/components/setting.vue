<template>
  <div>
    <div class="title" style="text-align: center">
      Hi!欢迎进行模拟面试<br />请先进行面试配置的完善哦~😉
    </div>
    <div style="display: flex; justify-content: center">
      <div class="interview-setting">
        <el-form :model="form" label-width="120px" class="setting-form">
          <el-form-item label="岗位名称">
            <el-input v-model="form.jobname" placeholder="请输入岗位名称"></el-input>
          </el-form-item>

          <el-form-item label="职业类型">
            <el-select v-model="form.jobtype" placeholder="请选择职业类型">
              <el-option label="软件工程师" value="软件工程师"></el-option>
              <el-option label="产品经理" value="产品经理"></el-option>
              <el-option label="数据分析师" value="数据分析师"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="面试强度">
            <el-slider v-model="form.intensity" :min="1" :max="10" show-stops></el-slider>
          </el-form-item>

          <el-form-item label="面试类型">
            <el-select v-model="form.interviewtype" placeholder="请选择面试类型">
              <el-option label="技术面试" value="技术面试"></el-option>
              <el-option label="素质测试" value="素质测试"></el-option>
              <el-option label="行为面试" value="行为面试"></el-option>
            </el-select>
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

const form = reactive({
    jobname: "",
    jobtype: "",
    intensity: 5,
    interviewtype: "",
    jobdescription: "",
    resume: "",
});

const selectedFile = ref(null);
const fileInput = ref(null);
const dialogVisible = ref(false);

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
};

const uploadService = async () => {
    if (!selectedFile.value) {
        ElMessage.error("请先选择文件！");
        return;
    }

    try {
        let response = await uploadFileService(selectedFile.value);

        if (response.code == 0) {
            ElMessage.success("上传简历成功！");
            form.resume = response.data;
        } else {
            ElMessage.error("上传简历失败，请重试！");
        }
    } catch (error) {
        console.error(error);
        ElMessage.error("上传简历过程中发生错误！");
    }
};

const resetForm = () => {
    form.jobname = "";
    form.jobtype = "";
    form.intensity = 5;
    form.interviewtype = "";
    form.jobdescription = "";
    form.resume = "";
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
    interviewSettingsStore.setSettings(form);
    router.push("/interview/room");
    dialogVisible.value = false;
};
</script>

<style scoped>
.interview-setting {
  padding: 20px;
  padding-top: 50px;
  padding-right: 70px;
  width: 600px;
  height: auto;
  background-color: white;
  border-radius: 8px;
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
</style>
