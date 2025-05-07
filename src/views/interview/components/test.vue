<template>
  <div>
    <input type="text" v-model="prompt" placeholder="请输入文字" />
    <button @click="convertToSpeech">转语音</button>
  </div>
</template>

<script lang="js" setup>
import {getAudio} from '@/api/audio.js'
import { ref } from 'vue';
const prompt = ref('');
const audioPath=ref('');
const convertToSpeech = async () => {
  let res = await getAudio(prompt.value)
  console.log(res)
  audioPath.value = res.data;
  const audioElement = new Audio(audioPath.value);
  audioElement.play();
}
</script>

<style scoped></style>
