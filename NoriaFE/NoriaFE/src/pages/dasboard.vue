<template>
  <div class="container">
    <p>សូមជ្រើសរើសអគារដើម្បីមើលព័ត៌មានលម្អិត</p>
    <div class="building-list">
      <router-link :to="`/rooms?id=${building.id}`"
        v-for="building in buildings"
        :key="building.id"
        class="card building-card"
      >
        <div class="building-summary-container">
            <div class="flex" style="margin-bottom: 25px;">
                <img src="/icons8-building-96.png" alt="" style="width: 35px">
                <p class="building-name">{{ building.name }}</p>
            </div>

          <p>បន្ទប់សរុប: {{ building.rooms }}</p>
          <p>បន្ទប់ទំនេរ: {{ building.rooms - building.occupiedRooms }}</p>
          <p>បន្ទប់កំពុងប្រើប្រាស់: {{ building.occupiedRooms }}</p>
          <p>បន្ទប់បង់លុយរួច: {{ building.paidRooms }}</p>
          <p>បន្ទប់មិនទាន់បង់លុយ: {{ building.rooms - building.paidRooms }}</p>
        </div>
        <img
          :src="building.img"
          alt="Building Icon"
          class="building-image"
          style="width: 200px"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Building } from "../models/building";
import useApi from "../composables/useApi";

const { getBuildings } = useApi();

const buildings = ref<Building[]>([]);

onMounted(async () => {
  try {
    const response = await getBuildings();
    buildings.value = response;
    console.log("Fetched buildings:", buildings.value);
  } catch (error) {
    console.error("Error fetching buildings:", error);
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
}
.building-card {
  display: flex;
  gap: 50px;
  text-decoration: none;
  color: var(--primary-text-color);
  transition: background-color 0.3s ease;
}
.building-card:hover {
  background-color: var(--fourth-color);
}
.building-card h2,
.building-card p {
  margin: 0;
}
.building-image {
  border-radius: 8px;
  border: solid 8px var(--border-color);
}
.building-name{
    font-size: 24px;
}
</style>
