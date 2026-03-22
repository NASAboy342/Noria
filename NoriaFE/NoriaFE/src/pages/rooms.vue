<script setup lang="ts">
import { ref, onMounted } from "vue";
import useApi from "../composables/useApi";
import { Room } from "../models/room";
import customTable from "../components/customTable.vue";
import roomDetail from "../components/roomDetail.vue";


const { getRooms } = useApi();

const rooms = ref<Room[]>([]);
const buildingid  = ref<number>(1); // Replace with the actual buildingId you want to fetch rooms for
const roomInKhmer = ref<any>([]);
onMounted(async () => {
    buildingid.value = parseInt(new URLSearchParams(window.location.search).get("id") || "1");
    rooms.value = await getRooms(buildingid.value); // Replace 1 with the desired buildingId
    roomInKhmer.value = rooms.value.map(room => ({
        បន្ទប់លេខ: room.roomName , លេខទូរស័ព្ទ: room.phoneNumber ,ជាន់ទី: room.floor ,បានបង់លុយហើយឫនៅ: room.isPaid ? "បានបង់" : "នៅ",នៅសល់: room.owe,កំណត់ចំណាំ: room.note // Replace with the actual translation logic if needed
    }));
    console.log("Fetched rooms:", rooms.value);
});
</script>
<style scoped>
.rooms-page {
    position: relative;
    min-height: calc(100vh - 140px);
}

.roomDetailsPopup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(760px, calc(100% - 32px));
    z-index: 10;
}
</style>

<template>
    <div class="rooms-page">
        <div class="card">
            <h1>Rooms</h1>
            <customTable :objects="roomInKhmer"/>
        </div>

        <div class="card roomDetailsPopup">
            <roomDetail />
        </div>
    </div>
</template>