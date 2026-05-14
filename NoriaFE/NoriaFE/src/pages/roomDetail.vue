<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { AddRoomPayload } from "../models/addRoomPayload";
import type { RoomUsage } from "../models/roomUsage";
import LoadingComponent from "../components/loadingComponent.vue";
import useApi from "../composables/useApi";
import roomPaymentForm from "../components/roomPaymentForm.vue";
import { Building } from "../models/building";

const roomId = ref<number>(0);
const buildingId = ref<number>(0);
const room = ref<AddRoomPayload | null>(null);
const building = ref<Building | null>(null);
const paymentHistory = ref<RoomUsage[]>([]);
const isLoading = ref(false);
const isShowAddPaymentPopup = ref(false);

onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    roomId.value = parseInt(params.get("roomId") || "0");
    buildingId.value = parseInt(params.get("buildingId") || "0");

    try {
        isLoading.value = true;
        // TODO: load room and payment history
        room.value = await useApi().getRoom(buildingId.value, roomId.value);
        building.value = await useApi().getBuildingById(buildingId.value);
        // paymentHistory.value = await getPaymentHistory(roomId.value);
    } finally {
        isLoading.value = false;
    }
});

const goBack = () => {
    window.location.href = `/rooms?id=${buildingId.value}`;
};
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
                        {{ room?.isOccupied ? '✅ បានបង់' : '❌ មិនទាន់បង់' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Payment History -->
        <div class="card">
            <div class="flex space-between align-center" style="margin-bottom: 20px;">
                <h2 style="margin: 0;">📋 ប្រវត្តិការបង់ប្រាក់</h2>
                <div class="button small" @click="isShowAddPaymentPopup = true">+ បន្ថែមវិក្កយបត្រ</div>
            </div>

            <LoadingComponent v-if="isLoading" style="margin-top: 20px;" />

            <div v-else-if="paymentHistory.length === 0" class="empty-state">
                <p style="color: var(--secondary-text-color); text-align: center; padding: 40px 0;">
                    មិនទាន់មានប្រវត្តិការបង់ប្រាក់
                </p>
            </div>
            
            <!-- paymentTable here -->
            
        </div>

    </div>

    <!-- Add Payment Popup -->
    <div class="popup-container" v-if="isShowAddPaymentPopup">
        <div class="card" style="width: fit-content;">
            <div class="flex space-between align-center" style="margin-bottom: 20px;">
                <h2 style="margin: 0;">+ បន្ថែមវិក្កយបត្រ</h2>
                <div class="button small negative" @click="isShowAddPaymentPopup = false">✕</div>
            </div>
            <!-- TODO: replace with roomPaymentForm component -->
            <roomPaymentForm @close="isShowAddPaymentPopup = false" :room="room" :building="building"/>
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
