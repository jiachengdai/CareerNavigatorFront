<template>
  <div>
    <div class="container">
      <div class="content">
        <!-- 数字人面试官视频区域 -->
        <div class="interviewer-area">
          <div
            style="
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 8px;
              color: #2563eb;
            "
          >
            <span>🎯</span>
            <span>正在面试：{{ interviewInfo.jobname }}</span>
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
              <div
                class="video-wrapper"
                style="position: relative; width: 100%; height: 100%"
              >
                <img
                  src="@/assets/imgs/interview-static.png"
                  alt="虚拟面试官"
                  class="video"
                  style="
                    border-radius: 16px;
                    max-height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                  "
                  :style="{
                    opacity: playVideo ? 0 : 1,
                    transition: 'opacity 0.01s ease',
                  }"
                />
                <video
                  src="@/assets/interview.mp4"
                  alt="虚拟面试官"
                  autoplay
                  loop
                  class="video"
                  style="
                    border-radius: 16px;
                    max-height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                  "
                  :style="{
                    opacity: playVideo ? 1 : 0,
                    transition: 'opacity 0.01s ease',
                  }"
                />
              </div>
            </div>

            <div
              class="current-container"
              style="flex: 2; padding: 16px; overflow-y: auto"
            >
              <h3
                style="
                  font-size: 22px;
                  font-weight: bold;
                  margin-bottom: 8px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  color: #2563eb;
                "
              >
                <span>💬</span>
                <span>当前问题</span>
              </h3>
              <hr
                style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 8px"
              />
              <div style="font-size: 18px; color: #4b5563">
                <span v-for="(message, index) in messages" :key="index">{{
                  message
                }}</span>
              </div>
              <!-- <p style="font-size: 18px; color: #4b5563">
                请描述你最近参与的一个项目，以及你在其中的角色和贡献。请描述你最近参与的一个项目，以及你在其中的角色和贡献。请描述你最近参与的一个项目，以及你在其中的角色和贡献。请描述你最近参与的一个项目，以及你在其中的角色和贡献。请描述你最近参与的一个项目，以及你在其中的角色和贡献。
              </p> -->
            </div>
          </div>
        </div>

        <!-- 用户摄像头区域 -->
        <div class="user-camera-area">
          <div class="camera-view">
            <video ref="videoRef" class="camera-video" autoplay muted></video>
          </div>
          <div class="recording-text" v-if="videoState">正在录像...</div>
          <div class="recording-text" style="color: red" v-if="!videoState">
            请开启摄像头！
          </div>
          <div class="buttons">
            <button class="stop-button" @click="startCamera" v-if="!videoState">
              打开摄像头
            </button>
            <button class="stop-button" @click="stopCamera" v-if="videoState">
              关闭摄像头
            </button>
            <button class="end-button" @click="stopInterview">结束面试</button>
          </div>
        </div>

        <div
          class="speech-result-area"
          :class="{ 'recording-active': isRecording }"
          style="border: 2px solid #e5e7eb; border-radius: 16px; padding: 16px"
        >
          <h2
            class="speech-result-title"
            style="display: flex; align-items: center; gap: 8px; color: #2563eb"
          >
            <span>📝</span>
            <span>你的回答:</span>
            <el-button style="margin-left: auto" @click="isCodingVisible = true"
              >写代码</el-button
            >
          </h2>
          <el-input
            class="speech-result"
            v-model="prompt"
            type="textarea"
            :rows="4"
            placeholder="请输入你的回答"
          />
          <div
            class="voice-controls"
            style="display: flex; justify-content: flex-end; gap: 16px; margin-top: 20px"
          >
            <el-button
              class="voice-button"
              @click="startRecording"
              v-if="!isRecording"
              style="
                font-size: 16px;
                padding: 12px 24px;
                display: flex;
                align-items: center;
                gap: 8px;
              "
            >
              <span>🎙️</span>
              <span>开启语音识别</span>
            </el-button>
            <el-button
              class="voice-button"
              @click="stopRecording"
              v-if="isRecording"
              style="
                font-size: 16px;
                padding: 12px 24px;
                display: flex;
                align-items: center;
                gap: 8px;
              "
            >
              <span>🛑</span>
              <span>停止语音识别</span>
            </el-button>
            <el-button
              class="send-button"
              @click="fetchData"
              style="
                font-size: 16px;
                padding: 12px 24px;
                display: flex;
                align-items: center;
                gap: 8px;
              "
              type="primary"
            >
              <span>📤</span>
              <span>发送回答</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="isCodingVisible" width="650px">
    <div>
      <div style="font-size: 24px; font-weight: bold">代码编辑器🗒️</div>
      <el-button
        style="
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 20px;
          margin-bottom: 10px;
        "
        @click="copyCode"
      >
        <span>📋</span>
        <span>复制代码</span>
      </el-button>
    </div>
    <div>
      <Codemirror
        v-model:value="code"
        :options="cmOptions"
        border
        ref="cmRef"
        height="400"
        width="600"
        @change="onChange"
        @input="onInput"
        @ready="onReady"
      >
      </Codemirror>
    </div>
  </el-dialog>
</template>

<script lang="js" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const isCodingVisible = ref(false); // 控制代码弹窗的显示
const playVideo = ref(false); // 控制视频播放
const videoState = ref(false); // 引用 video 元素
const videoRef = ref(null); // 引用 video 元素
const stream = ref(null); // 保存摄像头流
const copyCode = () => {
  navigator.clipboard.writeText(code.value).then(() => {
    ElMessage.success('代码已复制到剪贴板！');
  });
};
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
  console.log(interviewInfo);

});

// 页面卸载时停止摄像头
onBeforeUnmount(() => {
  stopCamera();
});



import CryptoJS from "crypto-js";

const config = {
  hostUrl: "wss://rtasr.xfyun.cn/v1/ws",
  appid: "008999e5", // 替换为您的 AppID
  apiKey: "93f0d70fc9cd59480bd13d9459dd78c5", // 替换为您的 APIKey
};

const ws = ref(null);
const audioContext = ref(null);
const mediaStream = ref(null);
const isRecording = ref(false);
const results = ref([]);

const getSigna = (ts) => {
  const md5 = CryptoJS.MD5(config.appid + ts).toString();
  const sha1 = CryptoJS.HmacSHA1(md5, config.apiKey);
  const base64 = CryptoJS.enc.Base64.stringify(sha1);
  return encodeURIComponent(base64);
};

const startRecording = async () => {
  try {
    const ts = parseInt(new Date().getTime() / 1000);
    const wssUrl =
      config.hostUrl + "?appid=" + config.appid + "&ts=" + ts + "&signa=" + getSigna(ts);

    ws.value = new WebSocket(wssUrl);

    ws.value.onopen = () => {
      console.log("WebSocket 连接成功");
    };

    ws.value.onmessage = (event) => {
      const res = JSON.parse(event.data);

      if (res.action == "result") {
        const data = JSON.parse(res.data);
        if (data.cn.st.type == 0) {
          let result = "";
          data.cn.st.rt.forEach((j) => {
            j.ws.forEach((k) => {
              k.cw.forEach((l) => {
                result += l.w;
              });
            });
          });
          results.value.push(result);
        }
      } else if (res.action == "error") {
        console.error(`错误：${res.code} - ${res.desc}`);
      }
    };

    ws.value.onclose = () => {
      console.log("WebSocket 连接关闭");
    };

    ws.value.onerror = (err) => {
      console.error("WebSocket 错误：", err);
    };

    mediaStream.value = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.value.createMediaStreamSource(mediaStream.value);
    const processor = audioContext.value.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.value.destination);

    processor.onaudioprocess = (e) => {
      if (!isRecording.value) return;
      const inputData = e.inputBuffer.getChannelData(0);
      const int16Data = float32ToInt16(inputData);
      ws.value.send(int16Data);
    };

    isRecording.value = true;
  } catch (err) {
    console.error("录音启动失败：", err);
  }
};

const stopRecording = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
  }
  if (audioContext.value) {
    audioContext.value.close();
  }
  if (ws.value) {
    ws.value.send(JSON.stringify({ end: true }));
    ws.value.close();
  }
  isRecording.value = false;
};

const float32ToInt16 = (buffer) => {
  const l = buffer.length;
  const result = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    result[i] = Math.min(1, buffer[i]) * 0x7fff;
  }
  return result.buffer;
};





import { fetchEventSource } from "@microsoft/fetch-event-source";
import { watch } from 'vue';
import {recordChat}from "@/api/chat.js"; // 导入记录聊天的 API 函数
const BaseUrl = "/api/chat/stream";
const prompt = ref(""); // 输入框绑定的值
const messages = ref([]); // 用于存储流式数据
const curGPTAnswer = ref(""); // 当前的 GPT 答案
const fetchData =async () => {

  messages.value = []; // 清空 messages 数组
  console.log("Prompt:", prompt.value); // 打印 prompt 的值
  console.log("Interview Info:", interviewInfo); // 打印面试信息
  await recordChat(prompt.value,interviewInfo.id,"user"); // 调用记录聊天的 API 函数
  const controller = new AbortController(); // 创建一个新的 AbortController
 await fetchEventSource(BaseUrl + "?prompt=" + encodeURIComponent(prompt.value), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller.signal, // 使用 controller 的信号
    onmessage: (message) => {
       messages.value.push(message.data); // 将消息添加到 messages 数组中
    },
    onerror: (error) => {
      console.error("Error occurred:", error); // 处理错误
    },
  });
  prompt.value = ""; // 清空输入框的值
  curGPTAnswer.value = messages.value.join(''); // 将 messages 数组拼接成的字符串赋值给 curGPTAnswer
  await recordChat(curGPTAnswer.value,interviewInfo.id,"assistant"); // 调用记录聊天的 API 函数

  convertToSpeech(); // 调用语音转换函数
};
const audioPath=ref('');
import { getAudio } from "@/api/audio.js"; // 导入语音转换的 API 函数
const convertToSpeech = async () => {
  let res = await getAudio(curGPTAnswer.value)
  console.log(res)
  audioPath.value = res.data;
  const audioElement = new Audio(audioPath.value);
  playVideo.value = true;
  audioElement.play();
  audioElement.onended = () => {
    playVideo.value = false;
  };
}
const stopInterview = () => {

  stopCamera(); // 停止摄像头
  stopRecording(); // 停止录音
  if (ws.value) {
    ws.value.close(); // 关闭 WebSocket 连接
  }
  if (audioContext.value) {
    audioContext.value.close(); // 关闭音频上下文
  }
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop()); // 停止媒体流
  }
  router.push('/interview/manage');
  getInterviewAssignment();

};
import { getInterviewAssignmentService } from "@/api/interview.js"; // 导入获取面试聊天记录的 API 函数
import router from '../../../router';
const getInterviewAssignment =  () => {
  let id = interviewInfo.id;

  getInterviewAssignmentService(id);

  }

  import "codemirror/mode/javascript/javascript.js";
  import Codemirror from "codemirror-editor-vue3";
import { onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';

  const code = ref(
    `var i = 0;
for (; i < 9; i++) {
    console.log(i);
    // more statements
}
`
  );

  const cmRef = ref();
  const cmOptions = {
    mode: "text/javascript",
  };

  const onChange = (val, cm) => {
    console.log(val);
    console.log(cm.getValue());
  };

  const onInput = (val) => {
    console.log(val);
  };

  const onReady = (cm) => {
    console.log(cm.focus());
  };

  onMounted(() => {
    setTimeout(() => {
      cmRef.value?.refresh();
    }, 1000);



  });

  onUnmounted(() => {
    cmRef.value?.destroy();
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
  font-size: 14px;
}

.buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stop-button {
  width: 100%;
  background-color: #2563eb;
  color: #ffffff;
  padding: 8px 0;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.stop-button:hover {
  background-color: #1d4ed8;
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
  margin-top: -10px;
  transition: box-shadow 0.3s ease;
}

.speech-result-area.recording-active {
  box-shadow: 0 0 15px 5px rgba(37, 99, 235, 0.6); /* 蓝色发光效果 */
  border-color: #2563eb; /* 边框颜色变为蓝色 */
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
  font-size: 16px;
  color: #1f2937;
  min-height: 110px;
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
