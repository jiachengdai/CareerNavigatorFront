import {defineStore}from 'pinia'
import { ref } from 'vue'
export const useInterviewSettingsStore=defineStore('interviewSettings',()=>{
    const settings=ref({})
    
    const setSettings=(newSettings)=>{
        settings.value=newSettings
       
      }
    const removeSettings=()=>{
        settings.value='';
    }
    return {settings,setSettings,removeSettings}
},{persist:true})
 
