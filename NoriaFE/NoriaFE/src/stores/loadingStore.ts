import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const loadingMessage = ref<string | undefined>(undefined)

  function startLoading(message?: string) {
    loadingMessage.value = message
    isLoading.value = true
  }

  function stopLoading() {
    isLoading.value = false
    loadingMessage.value = undefined
  }

  return { isLoading, loadingMessage, startLoading, stopLoading }
})
