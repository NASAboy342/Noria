<script setup lang="ts">
import { router } from "../router";
import { ref, watch } from "vue";
import { useMessageStore } from "../stores/messageStore";
import { useLoadingStore } from "../stores/loadingStore";

const loadingStore = useLoadingStore()
const currentPage = ref(router.currentRoute.value.path);
const pageName = ref(
  router.currentRoute.value.name
    ? router.currentRoute.value.name.toString()
    : "ជ្រើសរើសអគារ",
);

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    currentPage.value = newPath;
    pageName.value = router.currentRoute.value.name
      ? router.currentRoute.value.name.toString()
      : "ជ្រើសរើសអគារ";
    console.log("Current page:", currentPage.value);
  },
);

const messageStore = useMessageStore()
</script>

<template>
  <div class="desktop-layout">
    <div class="card nav-bar">
      <router-link
        to="/"
        :class="['button', 'nav-option', { selected: currentPage === '/' }]"
      >
        📊
        <p>ផ្សេងៗ</p>
      </router-link>
      <router-link
        to="/rooms"
        :class="[
          'button',
          'nav-option',
          { selected: currentPage === '/rooms' },
        ]"
      >
        🛏️
        <p>បន្ទប់</p>
      </router-link>
    </div>
  </div>
  <div class="card conten">
    <div class="card page-name"><p>{{ pageName }}</p></div>
    <router-view></router-view>
  </div>

  <!-- Loading overlay -->
  <Transition name="fade">
    <div v-if="loadingStore.isLoading" class="loading-overlay">
      <div class="loading-box">
        <div class="loading-spinner"></div>
        <p v-if="loadingStore.loadingMessage" class="loading-message">{{ loadingStore.loadingMessage }}</p>
      </div>
    </div>
  </Transition>

  <!-- Message popup -->
  <Transition name="fade">
    <div v-if="messageStore.messages.length > 0" class="message-popup">
      <TransitionGroup name="msg" tag="div" class="message-list">
        <div
          v-for="msg in messageStore.messages"
          :key="msg.id"
          :class="['card', msg.level]"
        >
          <span class="message-icon">{{ msg.level === 'error' ? '❌ ' : msg.level === 'success' ? '✅ ' : 'ℹ️ ' }}</span>
          <span class="message-text">{{ msg.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Transition>
</template>

<style scoped lang="css">
.desktop-layout {
  position: relative;
  width: 100%;
}

.nav-bar {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 12px;
  left: 25px;
  top: 25px;
  bottom: 25px;
  width: 200px;
}
.conten {
  position: relative;
  margin-left: 290px;
  margin-top: 8px;
  margin-right: 8px;
  right: 0px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: unset;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-message {
  color: #fff;
  font-size: 30px;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Message popup */
.message-popup {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
  pointer-events: none;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}


.card.success {
  color: rgba(34, 197, 94, 0.9);
}

.card.error {
  color: rgba(239, 68, 68, 0.9);
}

.message-icon {
  flex-shrink: 0;
}

.message-text {
  word-break: break-word;
  font-size: large;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.msg-enter-active,
.msg-leave-active {
  transition: all 0.35s ease;
}
.msg-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.msg-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.page-name {
  width: fit-content;
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-text-color);
}
.nav-option {
  justify-content: flex-start;
  padding-left: 20px;
  text-decoration: none;
  width: 160px;
}
</style>
