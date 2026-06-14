<script setup lang="ts">
import { ref, onMounted } from "vue";
import useApi from "../composables/useApi";
import { AddRoomPayload } from "../models/addRoomPayload";
import customTable from "../components/customTable.vue";
import roomPaymentForm from "../components/roomPaymentForm.vue";
import buildingDetail from "../components/buildingDetail.vue";
import addRoom from "../components/addRoom.vue";
import type { Building } from "../models/building";
import LoadingComponent from "../components/loadingComponent.vue";


const { getRooms, getBuildingById } = useApi();

const rooms = ref<AddRoomPayload[]>([]);
const buildingid  = ref<number>(1); // Replace with the actual buildingId you want to fetch rooms for
const roomInKhmer = ref<any>([]);
const building = ref<Building>();
const isShowBuildingDetailPopup = ref(false);
const isShowAddRoomPopup = ref(false);
const isLoading = ref(false);

const syncBuilding = async () => {
    building.value = await getBuildingById(buildingid.value);
}

const syncRoom = async () => {
    rooms.value = await getRooms(buildingid.value);
    roomInKhmer.value = rooms.value.map(room => ({
        បន្ទប់លេខ: room.name ,ជាន់ទី: room.floor ,មានអ្នកស្នាក់នៅហើយឬនៅ: room.isOccupied ? "🟢 មានអ្នកស្នាក់នៅ" : "🔴 គ្មានអ្នកស្នាក់នៅ",តម្លៃ: room.price
    }));
}

onMounted(async () => {
    try{
        isLoading.value = true;
        buildingid.value = parseInt(new URLSearchParams(window.location.search).get("id") || "1");
        await syncBuilding();
        await syncRoom();
    }
    finally{
        isLoading.value = false;
    }
});
const isShowRoomPaymentForm = ref(false);

const goToRoomDetail = (index: number) => {
    var roomId = rooms.value[index].id;
    console.log("Clicked row index:", index, "Room ID:", roomId);
    window.location.href = `/roomDetail?roomId=${roomId}&buildingId=${buildingid.value}`;
}


</script>
<style scoped>
.rooms-page {
    position: relative;
    min-height: calc(100vh - 140px);
}

.roomPaymentFormPopup {
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
            <!-- <div class="flex space-between">
                <h1>🛏️ ព័ត៍មានបន្ទប់របស់អាគារ [ {{ building?.name }} ]</h1>
                <div class="flex align-center">
                    <div class="button small" @click="isShowAddRoomPopup = true">🛏️ បន្ថែមបន្ទប់</div>
                    <div class="button small" @click="isShowBuildingDetailPopup = true">⚙️</div>
                </div>
            </div> -->
            <customTable :objects="roomInKhmer" @row-click="goToRoomDetail"/>
            <LoadingComponent v-if="isLoading" style="margin-top: 20px;"/>
        </div>


    </div>

    <div class="popup-container" v-if="isShowBuildingDetailPopup">
        <div class="card addBuildingPopup">
            <buildingDetail :building="building" @updated="syncBuilding" @close="isShowBuildingDetailPopup = false" />
        </div>
    </div>

    <div class="popup-container" v-if="isShowAddRoomPopup">
        <div class="card addBuildingPopup">
            <addRoom :buildingId="buildingid" @add="syncRoom" @close="isShowAddRoomPopup = false" />
        </div>
    </div>
</template>