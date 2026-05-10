<template>
  <div class="container">
    <div class="flex colomn">
      <p style="color: var(--secondary-text-color);">សូមជ្រើសរើសអគារដើម្បីមើលព័ត៌មានលម្អិត</p>
      <div class="button small" @click="isShowAddBuildingPopup = true">+ បន្ថែមអគារ </div>
    </div>
    <div class="building-list">
      <router-link :to="`/rooms?id=${building.id}`" v-for="building in buildings" :key="building.id"
        class="card building-card">
        <div class="building-summary-container">
          <div class="flex" style="margin-bottom: 25px;">
            <p class="building-name">🏢 {{ building.name }}</p>
          </div>

          <div style="color: var(--secondary-text-color);" class="flex colomn">
            <p>បន្ទប់សរុប: {{ building.rooms }}</p>
            <p>បន្ទប់ទំនេរ: {{ building.rooms - building.occupiedRooms }}</p>
            <p>បន្ទប់កំពុងប្រើប្រាស់: {{ building.occupiedRooms }}</p>
            <p>បន្ទប់បង់លុយរួច: {{ building.paidRooms }}</p>
            <p>បន្ទប់មិនទាន់បង់លុយ: {{ building.rooms - building.paidRooms }}</p>
          </div>
        </div>
        <img :src="building.img" alt="Building Image" class="building-image card" style="width: 200px" />
      </router-link>
    </div>
    <loadingComponent v-if="isShowLoading" />
  </div>

  <div class="popup-container" v-if="isShowAddBuildingPopup">
    <div class="card addBuildingPopup">
      <addBuilding @close="isShowAddBuildingPopup = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Building } from "../models/building";
import useApi from "../composables/useApi";
import addBuilding from "../components/addBuilding.vue";
import loadingComponent from "../components/loadingComponent.vue";

const { getBuildings } = useApi();

const buildings = ref<Building[]>([]);
const isShowAddBuildingPopup = ref(false);
const isShowLoading = ref(false);

onMounted(async () => {
  try {
    isShowLoading.value = true;
    const response = await getBuildings();
    buildings.value = response;
    console.log("Fetched buildings:", buildings.value);
  } catch (error) {
    console.error("Error fetching buildings:", error);
  }
  finally {
    isShowLoading.value = false;
  }
});
</script>

<style scoped lang="css">
.container {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.building-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.building-card {
  display: flex;
  gap: 50px;
  text-decoration: none;
  color: var(--primary-text-color);
  transition: background-color 0.3s ease;
}

.building-card:hover {
  background-color: var(--hover-color);
}

.building-card h2,
.building-card p {
  margin: 0;
}

.building-image {
  padding: 1px;
}

.building-name {
  font-size: 24px;
  font-weight: bold;
}

.addBuildingPopup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  z-index: 10;
}
</style>
