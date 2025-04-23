import {defineStore}from 'pinia'
import { ref } from 'vue'
export const useInterviewStore=defineStore('interviewId',()=>{
    const id=ref('')
    
    const setId=(newId)=>{
        id.value=newId
        console.log('id',id.value)
      }
    const removeId=()=>{
        id.value='';
    }
    return {id,setId,removeId}
},{persist:true})
 
