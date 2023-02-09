import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
    const isMobile = ref(false);
    return { isMobile }
});
