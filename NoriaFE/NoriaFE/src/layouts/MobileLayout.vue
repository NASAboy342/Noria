<script lang="ts" setup>
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
  (newPath, oldPath) => {
    currentPage.value = newPath;
    pageName.value = router.currentRoute.value.name
      ? router.currentRoute.value.name.toString()
      : "ជ្រើសរើសអគារ";
    console.log("Current page:", currentPage.value);
  },
);

const messageStore = useMessageStore()

const goBack = () => {
  if (router.currentRoute.value.path !== '/') {
    router.back();
  }
};
</script>

<template>
    <div class="mobile-layout">
        <div class="card mobile flex" style="justify-content: space-between; align-items: center;">
            <div class="button mobile" @click="goBack()">⬅️</div>
            <h1 style="margin: 0;">{{ pageName }}</h1>
            <div></div>
        </div>
        <div style="margin-top: 15px;">
            <router-view></router-view>
        </div>
     </div>
</template>

<style scoped lang="css">
.mobile-layout{
    padding: 15px;
}

</style>