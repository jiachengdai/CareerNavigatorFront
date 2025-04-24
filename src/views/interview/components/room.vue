<template>
  <div>
    <div class="container">
      <div class="content">
        <!-- 数字人面试官视频区域 -->
        <div class="interviewer-area">
          <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px">
            正在面试：{{ interviewInfo.jobname }}
          </div>
          <div class="video-container" style="display: flex; gap: 16px">
            <div
              class="hr-container"
              style="
                flex: 1.8;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <img
                v-if="!playVideo"
                src="@/assets/imgs/interview-static.png"
                alt="虚拟面试官"
                class="video"
                style="border-radius: 16px; max-height: 100%"
              />
              <video
                v-if="playVideo"
                src="@/assets/interview.mp4"
                alt="虚拟面试官"
                autoplay
                loop
                class="video"
                style="border-radius: 16px; max-height: 100%"
              />
            </div>

            <div
              class="current-container"
              style="flex: 2; padding: 16px; overflow-y: auto"
            >
              <h3 style="font-size: 22px; font-weight: bold; margin-bottom: 8px">
                当前问题
              </h3>
              <p style="font-size: 18px; color: #4b5563">
                请描述你最近参与的一个项目，以及你在其中的角色和贡献。请描述你最近参与的一个项目，以及你在其中的角色和贡献。请描述你最近参与的一个项目，以及你在其中的角色和贡献。请描述你最近参与的一个项目，以及你在其中的角色和贡献。请描述你最近参与的一个项目，以及你在其中的角色和贡献。
              </p>
            </div>
          </div>
        </div>

        <!-- 用户摄像头区域 -->
        <div class="user-camera-area">
          <div class="camera-view">
            <video ref="videoRef" class="camera-video" autoplay muted></video>
          </div>
          <div class="recording-text" v-if="videoState">正在录像...</div>
          <div class="buttons">
            <button class="stop-button" @click="startCamera" v-if="!videoState">
              打开摄像头
            </button>
            <button class="stop-button" @click="stopCamera" v-if="videoState">
              关闭摄像头
            </button>
            <button class="end-button">结束面试</button>
          </div>
        </div>

        <!-- 语音识别结果显示区域 -->
        <div class="speech-result-area">
          <h2 class="speech-result-title">你的回答（语音识别结果）:</h2>
          <div class="speech-result" contenteditable="true">
            我最近参与了一个基于Vue3+SpringBoot的校园志愿服务管理系统的开发，主要负责群聊模块的设计与实现......
          </div>
          <!-- 发送和开启语音的按钮 -->
          <div
            class="voice-controls"
            style="display: flex; justify-content: flex-end; gap: 16px; margin-top: 20px"
          >
            <el-button
              class="voice-button"
              @click="startVoiceRecognition"
              style="font-size: 16px; padding: 12px 24px"
              >开启语音识别</el-button
            >
            <el-button
              class="send-button"
              @click="sendResponse"
              style="font-size: 16px; padding: 12px 24px"
              >发送回答</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const playVideo = ref(false); // 控制视频播放
const videoState = ref(false); // 引用 video 元素
const videoRef = ref(null); // 引用 video 元素
const stream = ref(null); // 保存摄像头流

// 打开摄像头
const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
      videoRef.value.play();
        videoState.value = true; // 摄像头已打开
    }
  } catch (error) {
    console.error("无法访问摄像头:", error);
  }
};

// 停止摄像头
const stopCamera = () => {
  if (stream.value) {
    const tracks = stream.value.getTracks();
    tracks.forEach((track) => track.stop());
    stream.value = null;
    videoState.value = false; // 摄像头已关闭
  }
};
import {useInterviewSettingsStore} from "@/store/interviewSettings.js";
const interviewSettingsStore = useInterviewSettingsStore();
let interviewInfo=ref({});
// 页面挂载时启动摄像头
onMounted(() => {
  startCamera();
  interviewInfo =interviewSettingsStore.settings;

});

// 页面卸载时停止摄像头
onBeforeUnmount(() => {
  stopCamera();
});
</script>

<style scoped>
.container {
  background-color: #f3f4f6;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.content {
  background-color: #ffffff;
  width: 100%;
  height: 96vh;

  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
}

.interviewer-area {
  position: relative;
}

.video-container {
  border-radius: 16px;
  height: 400px;
  display: flex;
  overflow: hidden;
}

.video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.interviewer-text {
  margin-top: 16px;
  color: #4b5563;
}

.user-camera-area {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
}

.camera-view {
  background-color: #1f2937;
  border-radius: 16px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.recording-text {
  margin-top: 16px;
  color: #6b7280;
  font-size: 0.875rem;
}

.buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stop-button {
  width: 100%;
  background-color: #4f46e5;
  color: #ffffff;
  padding: 8px 0;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.stop-button:hover {
  background-color: #4338ca;
}

.end-button {
  width: 100%;
  background-color: #e5e7eb;
  color: #1f2937;
  padding: 8px 0;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.end-button:hover {
  background-color: #d1d5db;
}

.speech-result-area {
  grid-column: span 3;
  margin-top: 10px;
}

.speech-result-title {
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 8px;
}

.speech-result {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  color: #1f2937;
  min-height: 120px;
}
.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}
.hr-container {
  border-radius: 16px;
  height: 100%;
}
.current-container {
  border-radius: 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
}
</style>
