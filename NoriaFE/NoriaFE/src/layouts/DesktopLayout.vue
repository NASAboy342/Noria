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
        <img src="/icons8-dashboard-96.png" alt="Dashboard Icon" style="width: 28px;" />
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
        <img src="/icons8-room-96.png" alt="Rooms Icon" style="width: 28px;" />
        <p>បន្ទប់</p>
      </router-link>
    </div>
  </div>
  <div class="card conten">
    <div class="card page-name selected"><p>{{ pageName }}</p></div>
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
  width: 250px;
  height: 100vh;
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
}
.page-name {
  width: fit-content;
  font-size: 24px;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 5px;
}
.nav-option {
  justify-content: flex-start;
  padding-left: 20px;
  text-decoration: none;
}
</style>
