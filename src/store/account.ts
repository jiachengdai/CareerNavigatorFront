import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types/api'

export const useAccountInfoStore = defineStore('account', () => {
    const info = ref<UserInfo | null>(null)

    const setInfo = (newInfo: UserInfo) => {
        info.value = newInfo
    }

    const removeInfo = () => {
        info.value = null
    }

    return { info, setInfo, removeInfo }
}, {
    persist: true
}) 