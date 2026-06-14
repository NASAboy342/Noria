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

<template>
    <div class="flex colomn" style="gap: 15px;">
      <router-link :to="`/rooms?id=${building.id}`" v-for="building in buildings" :key="building.id" class="card flex" style="justify-content: space-between; align-items: center; text-decoration: none; color: var(--text-color);">
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
        <img :src="building.img" alt="Building Image" class="building-image card" style="height: 100px" />
      </router-link>
    </div>
    <loadingComponent v-if="isShowLoading" />
</template>

<style scoped lang="css">
.building-name{
    font-size: 24px;
    font-weight: bold;
}
</style>