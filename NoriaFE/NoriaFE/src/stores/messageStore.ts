import { defineStore } from 'pinia'
import { ref } from 'vue'

export type MessageLevel = 'info' | 'success' | 'error'

export interface AppMessage {
  id: number
  message: string
  level: MessageLevel
  timestamp: number
}

let _idCounter = 0

export const useMessageStore = defineStore('message', () => {
  const messages = ref<AppMessage[]>([])
  const messageLifetime = ref(5_000) // Messages live for 5 seconds

  function SetMessage(message: string, level: MessageLevel) {
    messages.value.push({
      id: ++_idCounter,
      message,
      level,
      timestamp: Date.now(),
    })
  }

  function _removeExpired() {
    const cutoff = Date.now() - messageLifetime.value
    messages.value = messages.value.filter((m) => m.timestamp > cutoff)
  }

  // Start the cleanup scheduler once when the store is created
  setInterval(_removeExpired, 1_000)

  return { messages, SetMessage }
})
