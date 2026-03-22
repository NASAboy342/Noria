<script setup lang="ts">
import { ref, onMounted } from "vue";
import useApi from "../composables/useApi";
import { Room } from "../models/room";
import customTable from "../components/customTable.vue";

const { getRooms } = useApi();

const rooms = ref<Room[]>([]);
const buildingid  = ref<number>(1); // Replace with the actual buildingId you want to fetch rooms for
onMounted(async () => {
    buildingid.value = parseInt(new URLSearchParams(window.location.search).get("id") || "1");
    rooms.value = await getRooms(buildingid.value); // Replace 1 with the desired buildingId
    console.log("Fetched rooms:", rooms.value);
});
</script>

<template>
    <div class="card">
        <h1>Rooms</h1>
        <customTable :objects="rooms"/>
    </div>
</template>