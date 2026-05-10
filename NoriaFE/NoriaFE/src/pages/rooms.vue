<script setup lang="ts">
import { ref, onMounted } from "vue";
import useApi from "../composables/useApi";
import { Room } from "../models/room";
import customTable from "../components/customTable.vue";
import roomDetail from "../components/roomDetail.vue";
import buildingDetail from "../components/buildingDetail.vue";
import type { Building } from "../models/building";


const { getRooms, getBuildingById } = useApi();

const rooms = ref<Room[]>([]);
const buildingid  = ref<number>(1); // Replace with the actual buildingId you want to fetch rooms for
const roomInKhmer = ref<any>([]);
const building = ref<Building>();
const isShowBuildingDetailPopup = ref(false);

const syncBuilding = async () => {
    building.value = await getBuildingById(buildingid.value);
}

onMounted(async () => {
    buildingid.value = parseInt(new URLSearchParams(window.location.search).get("id") || "1");
    await syncBuilding();
    rooms.value = await getRooms(buildingid.value); // Replace 1 with the desired buildingId
    roomInKhmer.value = rooms.value.map(room => ({
        បន្ទប់លេខ: room.roomName , លេខទូរស័ព្ទ: room.phoneNumber ,ជាន់ទី: room.floor ,បានបង់លុយហើយឫនៅ: room.isPaid ? "បានបង់" : "នៅ",នៅសល់: room.owe,កំណត់ចំណាំ: room.note // Replace with the actual translation logic if needed
    }));
    console.log("Fetched rooms:", rooms.value);
});
const isShowRoomDetails = ref(false);


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
    width: 1000px;
    z-index: 10;
}
.addBuildingPopup{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    z-index: 10;
}
.popup-container{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
    /* background-color: rgba(0, 0, 0, 0.03); */
    backdrop-filter: blur(2px);
}
</style>

<template>
    <div class="rooms-page">
        <div class="card">
            <div class="flex space-between">
                <h1>🛏️ ព័ត៍មានបន្ទប់របស់អាគារ {{ building?.name }}</h1>
                <div class="flex align-center">
                    <div class="button small" @click="isShowBuildingDetailPopup = true">⚙️</div>
                </div>
            </div>
            <customTable :objects="roomInKhmer" @row-click="isShowRoomDetails = true"/>
        </div>

        <div class="popup-container" v-if="isShowRoomDetails">
            <div class="card roomDetailsPopup">
                <roomDetail @close="isShowRoomDetails = false"/>
            </div>
        </div>
    </div>

    <div class="popup-container" v-if="isShowBuildingDetailPopup">
        <div class="card addBuildingPopup">
            <buildingDetail :building="building" @updated="syncBuilding" @close="isShowBuildingDetailPopup = false" />
        </div>
  </div>
</template>