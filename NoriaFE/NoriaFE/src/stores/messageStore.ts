import { defineStore } from 'pinia'
import { ref } from 'vue'

export type MessageLevel = 'info' | 'success' | 'error'

export interface AppMessage {
  id: number
  message: string
  level: 'info' | 'success' | 'error'
  timestamp: number
  lifetime: number
}

let _idCounter = 0

export const useMessageStore = defineStore('message', () => {
  const messages = ref<AppMessage[]>([])

  function SetMessage(message: string, level: MessageLevel) {
    const lifetime =
      level === 'error'
        ? 10_000
        : 2_000

    messages.value.push({
      id: ++_idCounter,
      message,
      level,
      timestamp: Date.now(),
      lifetime,
    })
  }

  function _removeExpired() {
    const now = Date.now()

    messages.value = messages.value.filter(
      (m) => now - m.timestamp < m.lifetime
    )
  }

  setInterval(_removeExpired, 1_000)

  return { messages, SetMessage }
})
