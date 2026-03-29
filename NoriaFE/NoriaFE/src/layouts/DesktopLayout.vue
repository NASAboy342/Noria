<script setup lang="ts">
import { router } from "../router";
import { ref, watch } from "vue";

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
  gap: 10px;
  box-shadow: unset;
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
