<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { AddRoomPayload } from "../models/addRoomPayload";
import { RoomUsage } from "../models/roomUsage";
import LoadingComponent from "../components/loadingComponent.vue";
import useApi from "../composables/useApi";
import roomPaymentForm from "../components/roomPaymentForm.vue";
import { Building } from "../models/building";
import CustomTable from "../components/customTable.vue";
import updateRoomForm from "../components/updateRoomForm.vue";

const roomId = ref<number>(0);
const buildingId = ref<number>(0);
const room = ref<AddRoomPayload>(new AddRoomPayload());
const building = ref<Building>(new Building());
const paymentHistory = ref<RoomUsage[]>([]);
const paymentHistoryInKhmerForDisplay = ref<any>([]);
const isLoading = ref(false);
const isShowAddPaymentPopup = ref(false);
const lastRowsToFetch = 100;
const paymentStatusLabel = ref<string>("---");
const isShowUpdateRoom = ref(false);

const syncPaymentHistory = async () => {
    if (!roomId.value || !buildingId.value) return;

    try {
        isLoading.value = true;
        paymentHistory.value = await useApi().getPaymentHistory(roomId.value, lastRowsToFetch);
    } finally {
        isLoading.value = false;
    }
};

const syncDate = async () => {
    try {
        isLoading.value = true;
        // TODO: load room and payment history
        room.value = await useApi().getRoom(buildingId.value, roomId.value);
        building.value = await useApi().getBuildingById(buildingId.value);
        await syncPaymentHistory();
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    roomId.value = parseInt(params.get("roomId") || "0");
    buildingId.value = parseInt(params.get("buildingId") || "0");

    await syncDate();
});

const goBack = () => {
    window.location.href = `/rooms?id=${buildingId.value}`;
};

watch(() => paymentHistory.value, () => {
    paymentHistoryInKhmerForDisplay.value = paymentHistory.value.map(payment => ({
        ចាប់ពី: new Date(payment.startTime).toLocaleDateString('km-KH'),
        ដល់: new Date(payment.endTime).toLocaleDateString('km-KH'),
        ចំនួនទឹកប្រាក់សរុប: payment.totalAmountToPay,
        បានបង់ហើយឬនៅ: payment.isPaid ? "✅ បានបង់" : (payment.totalAmountPaid ?? 0) > 0 ? "🟡 នៅសល់" : "❌ មិនទាន់បង់",
        បានបង់នៅ:  payment.isPaid ? new Date(payment.paidOn).toLocaleDateString('km-KH') : "---",
    }));

    paymentStatusLabel.value = paymentHistory.value.some(payment => !payment.isPaid) ? "❌ នៅសល់" : paymentHistory.value.length > 0 ? "✅ បានបង់រួចហើយ" : "---";
});

const openRoomPaymentDetail = (index: number) => {
    var paymentId = paymentHistory.value[index].id;
    window.location.href = `/roomPaymentDetail?paymentId=${paymentId}&roomId=${roomId.value}&buildingId=${buildingId.value}`;
}

const CheckinCheckOut = async (isCheckIn: boolean) => {
    if (!room.value) return;
    if (!confirm(isCheckIn ? "តើអ្នកប្រាកដថាមានអ្នកចូលនៅបន្ទប់នេះហើយឬនៅ?" : "តើអ្នកប្រាកដថាគេឈប់នៅបន្ទប់នេះហើយឬនៅ?")) return;
    try{
        isLoading.value = true;
        room.value.isOccupied = isCheckIn;
        await useApi().updateRoom(room.value);
        await syncDate();
    }
    finally{
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="room-detail-page">

        <!-- Header -->
        <div class="flex align-center" style="margin-bottom: 20px; gap: 15px;">
            <div class="button small" @click="goBack">← ត្រលប់</div>
            <h1 style="margin: 0;">🛏️ ព័ត៌មានបន្ទប់</h1>
        </div>

        <!-- Room Info Card -->
        <div class="card room-info-card" style="margin-bottom: 20px;">
            <div class="flex space-between align-center" style="margin-bottom: 20px;">
                <h2 style="margin: 0;">{{ room?.name ?? '---' }}</h2>
                <div
                    class="status-badge"
                    :class="room?.isOccupied ? 'occupied' : 'vacant'"
                >
                    {{ room?.isOccupied ? '🟢 មានអ្នកស្នាក់នៅ' : '🔴 គ្មានអ្នកស្នាក់នៅ' }}
                </div>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <p class="info-label">ជាន់ទី</p>
                    <p class="info-value">{{ room?.floor ?? '---' }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">លេខទូរស័ព្ទ</p>
                    <p class="info-value">{{ room?.phoneNumber || '---' }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">តម្លៃបន្ទប់</p>
                    <p class="info-value focus">$ {{ room?.price ?? '---' }}</p>
                </div>
                <div class="info-item">
                    <p class="info-label">ស្ថានភាពការបង់ប្រាក់</p>
                    <p class="info-value" :class="room?.isOccupied ? '' : 'negative'">
                        {{ paymentStatusLabel }}
                    </p>
                </div>
            </div>
        </div>

        <div class="card room-info-card" style="margin-bottom: 20px;">
            <div class="flex" style="gap: 10px; justify-content: flex-end;">
                <div class="button small" @click="isShowUpdateRoom = true"> ⚙️ កែប្រែព័ត៌មានបន្ទប់</div>
                <div v-if="room?.isOccupied" class="button small" @click="CheckinCheckOut(false)" > ❌ ឈប់នៅ</div>
                <div v-else class="button small" @click="CheckinCheckOut(true)" > ✅ ចូលនៅ</div>
            </div>
        </div>

        <!-- Payment History -->
        <div class="card">
            <div class="flex space-between align-center" style="margin-bottom: 20px;">
                <h2 style="margin: 0;">📋 ប្រវត្តិការបង់ប្រាក់</h2>
                <div class="button small" @click="isShowAddPaymentPopup = true">+🧾 សរសេរវិក្កយបត្រថ្មី</div>
            </div>

            <LoadingComponent v-if="isLoading" style="margin-top: 20px;" />

            <div v-else-if="paymentHistory.length === 0" class="empty-state">
                <p style="color: var(--secondary-text-color); text-align: center; padding: 40px 0;">
                    មិនទាន់មានប្រវត្តិការបង់ប្រាក់
                </p>
            </div>
            
            <CustomTable :objects="paymentHistoryInKhmerForDisplay" @row-click="openRoomPaymentDetail"/>
            
        </div>

    </div>

    <!-- Add Payment Popup -->
    <div class="popup-container" v-if="isShowAddPaymentPopup">
        <div class="card" style="width: fit-content; max-height: 90vh; overflow-y: auto;">
            <div class="flex space-between align-center" style="margin-bottom: 20px;">
                <h2 style="margin: 0;">+ សរសេរវិក្កយបត្រថ្មី</h2>
                <div class="button small negative" @click="isShowAddPaymentPopup = false">✕</div>
            </div>
            <!-- TODO: replace with roomPaymentForm component -->
            <roomPaymentForm @close="isShowAddPaymentPopup = false" @paymentCreated="syncPaymentHistory" :room="room" :building="building" :lastRoomUsage="paymentHistory[0]"/>
        </div>
    </div>

    <div class="popup-container" v-if="isShowUpdateRoom">
        <div class="card" style="width: fit-content;">
            <div class="flex space-between align-center" style="margin-bottom: 20px;">
                <h2 style="margin: 0;">⚙️ កែប្រែព័ត៌មានបន្ទប់</h2>
                <div class="button small negative" @click="isShowUpdateRoom = false">✕</div>
            </div>
            <!-- TODO: replace with updateRoomForm component -->
            <updateRoomForm @close="isShowUpdateRoom = false" :room="room" :building="building" @update="syncDate"/>
        </div>
    </div>
</template>

<style scoped>
.room-detail-page {
    display: flex;
    flex-direction: column;
}

.room-info-card {
    display: flex;
    flex-direction: column;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.info-label {
    color: var(--secondary-text-color);
    font-size: 14px;
    margin: 0;
}

.info-value {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}

.status-badge {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    box-shadow: var(--pop-shadow-shallow);
}

.status-badge.occupied {
    color: #16a34a;
}

.status-badge.vacant {
    color: var(--secondary-text-color);
}


</style>
