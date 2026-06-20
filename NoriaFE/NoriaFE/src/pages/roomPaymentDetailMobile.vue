<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { AddRoomPayload } from "../models/addRoomPayload.ts";
import type { RoomUsage } from "../models/roomUsage.ts";
import type { Building } from "../models/building.ts";
import LoadingComponent from "../components/loadingComponent.vue";
import useApi from "../composables/useApi.ts";
import updateRoomPaymentForm from "../components/updateRoomPaymentForm.vue";

const paymentId = ref<number>(0);
const roomId = ref<number>(0);
const buildingId = ref<number>(0);

const payment = ref<RoomUsage | null>(null);
const room = ref<AddRoomPayload | null>(null);
const building = ref<Building | null>(null);
const isLoading = ref(false);
const isShowPaymentPopup = ref(false);
const isShowPaymentUpdate = ref(false);
const amountPaying = ref<number>(0);

const syncData = async () => {
    try {
        isLoading.value = true;
        payment.value = await useApi().getPaymentById(paymentId.value);
        room.value = await useApi().getRoom(buildingId.value, roomId.value);
        building.value = await useApi().getBuildingById(buildingId.value);
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    paymentId.value = parseInt(params.get("paymentId") || "0");
    roomId.value = parseInt(params.get("roomId") || "0");
    buildingId.value = parseInt(params.get("buildingId") || "0");

    await syncData();
});

const goBack = () => {
    window.location.href = `/roomDetail?roomId=${roomId.value}&id=${buildingId.value}&buildingId=${buildingId.value}`;
};

const updatePayment = () => {
    isShowPaymentUpdate.value = true;
};

const markAsPaid = () => {
    amountPaying.value = (payment.value?.totalAmountToPay ?? 0) - (payment.value?.totalAmountPaid ?? 0);
    isShowPaymentPopup.value = true;
};

const confirmPayment = async () => {
    if (!payment.value) return;
    try {
        isLoading.value = true;
        isShowPaymentPopup.value = false;
        const updated: RoomUsage = {
            ...payment.value,
            totalAmountPaid: (payment.value.totalAmountPaid ?? 0) + amountPaying.value,
            isPaid: ((payment.value.totalAmountPaid ?? 0) + amountPaying.value) >= (payment.value.totalAmountToPay ?? 0),
            paidOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
        };
        await useApi().doPayment(updated);
        payment.value = await useApi().getPaymentById(paymentId.value);
    } finally {
        isLoading.value = false;
    }
};

const cancelPayment = async () => {
    if (!payment.value) return;
    if (!confirm("តើអ្នកប្រាកដថាចង់លុបចោលការបង់ប្រាក់នេះ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។")) return;

    try {
        isLoading.value = true;
        const updated: RoomUsage = {
            ...payment.value,
            totalAmountPaid: 0,
            isPaid: false,
            updatedOn: new Date().toISOString(),
        };
        await useApi().updatePayment(updated);
        payment.value = await useApi().getPaymentById(paymentId.value);
        await syncData();
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="payment-detail-page">

        <!-- Header -->
        <!-- <div class="flex align-center" style="margin-bottom: 20px; gap: 15px;">
            <div class="button small" @click="goBack">← ត្រលប់</div>
            <h2 style="margin: 0;">🧾 #{{ paymentId }}</h2>
        </div> -->

        <LoadingComponent v-if="isLoading" style="margin-top: 40px;" />

        <div v-else class="content-grid">

            <!-- Payment Status Banner -->
            <div
                class="card mobile status-banner"
                :class="payment?.isPaid ? 'paid' : (payment?.totalAmountPaid ?? 0) > 0 ? 'partial' : 'unpaid'"
                style="margin-bottom: 0;"
            >
                <div class="flex align-center" style="gap: 12px;">
                    <span class="status-icon">{{ payment?.isPaid ? '✅' : (payment?.totalAmountPaid ?? 0) > 0 ? '🟡' : '❌' }}</span>
                    <div>
                        <p class="status-label">ស្ថានភាព</p>
                        <p class="status-value">{{ payment?.isPaid ? 'បានបង់រួចហើយ' : (payment?.totalAmountPaid ?? 0) > 0 ? 'នៅសល់' : 'មិនទាន់បង់' }}</p>
                    </div>
                    <div v-if="payment?.isPaid" style="margin-left: auto; text-align: right; display: flex; flex-direction: column; gap: 10px;">
                        <p class="status-label">បានបង់នៅថ្ងៃ</p>
                        <p class="status-value">{{ payment?.paidOn ? new Date(payment.paidOn).toLocaleDateString('km-KH') : '---' }}</p>
                        <div class="button small" @click="cancelPayment">❌ លុបចោលការបង់ប្រាក់</div>
                    </div>
                    <div v-else style="margin-left: auto; display: flex; gap: 10px;">
                        <!-- <div class="button small" @click="updatePayment">🔧 កែសម្រួលវិក្កយបត្រ</div> -->
                        <div class="button small" @click="markAsPaid">✔ ធ្វើការបង់ប្រាក់</div>
                    </div>
                </div>
            </div>

            <!-- Period Card -->
            <div class="card mobile">
                <h3 class="section-title">📅 រយៈពេល</h3>
                <div class="info-row">
                    <div class="info-item">
                        <p class="info-label">ចាប់ពី</p>
                        <p class="info-value">{{ payment?.startTime ? new Date(payment.startTime).toLocaleDateString('km-KH') : '---' }}</p>
                    </div>
                    <div class="divider-arrow">→</div>
                    <div class="info-item">
                        <p class="info-label">ដល់</p>
                        <p class="info-value">{{ payment?.endTime ? new Date(payment.endTime).toLocaleDateString('km-KH') : '---' }}</p>
                    </div>
                </div>
            </div>

            <!-- Breakdown Card -->
            <div class="card mobile">
                <h3 class="section-title">💰 ព័ត៌មានលម្អិតការបង់ប្រាក់</h3>

                <div class="breakdown-table">
                    <!-- Room Rent -->
                    <div class="breakdown-row">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🛏️</span>
                            <span>តម្លៃបន្ទប់</span>
                        </div>
                        <div class="breakdown-value">$ {{ room?.price ?? '---' }}</div>
                    </div>

                    <!-- Water -->
                    <div class="breakdown-row">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">💧</span>
                            <span>ទឹក</span>
                        </div>
                        <div class="breakdown-detail">
                            <span class="breakdown-sub">{{ payment?.waterUsage ?? '---' }} គូប × ៛ {{ building?.waterPricePerUnit ?? '---' }}</span>
                            <span class="breakdown-value">៛ {{ payment?.waterPrice ?? '---' }}</span>
                        </div>
                    </div>

                    <!-- Electricity -->
                    <div class="breakdown-row">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">⚡</span>
                            <span>ភ្លើង</span>
                        </div>
                        <div class="breakdown-detail">
                            <span class="breakdown-sub">{{ payment?.electricityUsage ?? '---' }} kw × ៛ {{ building?.electricityPricePerUnit ?? '---' }}</span>
                            <span class="breakdown-value">៛ {{ payment?.electricityPrice ?? '---' }}</span>
                        </div>
                    </div>

                    <!-- Adjustment -->
                    <div class="breakdown-row">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🔧</span>
                            <span>កែសម្រួល</span>
                        </div>
                        <div class="breakdown-detail">
                            <span class="breakdown-sub">---</span>
                            <span class="breakdown-value">៛ {{ payment?.adjustmentAmount ?? '---' }}</span>
                        </div>
                    </div>

                    <div class="breakdown-divider" />

                    <!-- Total -->
                    <div class="breakdown-row total-row">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">🧮</span>
                            <span>សរុប</span>
                        </div>
                        <div class="breakdown-value total-value">៛ {{ payment?.totalAmountToPay ?? '---' }}</div>
                    </div>

                    <!-- Amount Paid -->
                    <div class="breakdown-row">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">💵</span>
                            <span>ចំនួនដែលបានបង់</span>
                        </div>
                        <div class="breakdown-value positive">៛ {{ payment?.totalAmountPaid ?? '---' }}</div>
                    </div>

                    <!-- Remaining -->
                    <div class="breakdown-row">
                        <div class="breakdown-label">
                            <span class="breakdown-icon">⏳</span>
                            <span>នៅសល់</span>
                        </div>
                        <div
                            class="breakdown-value"
                            :class="(payment?.totalAmountToPay ?? 0) - (payment?.totalAmountPaid ?? 0) > 0 ? 'negative' : 'positive'"
                        >
                            ៛ {{ (payment?.totalAmountToPay ?? 0) - (payment?.totalAmountPaid ?? 0) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Room Info Card -->
            <div class="card mobile">
                <h3 class="section-title">🛏️ ព័ត៌មានបន្ទប់</h3>
                <div class="meta-grid">
                    <div class="info-item">
                        <p class="info-label">ឈ្មោះបន្ទប់</p>
                        <p class="info-value">{{ room?.name ?? '---' }}</p>
                    </div>
                    <div class="info-item">
                        <p class="info-label">ជាន់ទី</p>
                        <p class="info-value">{{ room?.floor ?? '---' }}</p>
                    </div>
                    <div class="info-item">
                        <p class="info-label">លេខទូរស័ព្ទ</p>
                        <p class="info-value">{{ room?.phoneNumber || '---' }}</p>
                    </div>
                    <div class="info-item">
                        <p class="info-label">អគារ</p>
                        <p class="info-value">{{ building?.name ?? '---' }}</p>
                    </div>
                </div>
            </div>

            <!-- Timestamps -->
            <div class="card mobile timestamps-card">
                <h3 class="section-title">🕐 ព័ត៌មានពេលវេលា</h3>
                <div class="meta-grid">
                    <div class="info-item">
                        <p class="info-label">បង្កើតនៅ</p>
                        <p class="info-value small">{{ payment?.createdOn ? new Date(payment.createdOn).toLocaleString('km-KH') : '---' }}</p>
                    </div>
                    <div class="info-item">
                        <p class="info-label">កែប្រែចុងក្រោយ</p>
                        <p class="info-value small">{{ payment?.updatedOn ? new Date(payment.updatedOn).toLocaleString('km-KH') : '---' }}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div v-if="isShowPaymentUpdate" class="popup-container">
        <div class="card mobile" style="width: fit-content;">
            <div class="flex space-between align-center" style="margin-bottom: 20px;">
                <h2 style="margin: 0;">🔧 កែសម្រួលវិក្កយបត្រ</h2>
                <div class="button small negative" @click="isShowPaymentUpdate = false">✕</div>
            </div>
            <updateRoomPaymentForm :paymentId="paymentId" :roomId="roomId" :buildingId="buildingId" @close="isShowPaymentUpdate = false" @payment-updated="syncData" />
        </div>
    </div>

    <!-- Payment Popup -->
    <div class="popup-container" v-if="isShowPaymentPopup">
        <div class="card mobile" style="width: 300px;">
            <div class="flex space-between align-center" style="margin-bottom: 20px;">
                <h2 style="margin: 0;">💵 ធ្វើការបង់ប្រាក់</h2>
                <div class="button small negative" @click="isShowPaymentPopup = false">✕</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Summary -->
                <div style="display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 8px; box-shadow: var(--dented-shadow-shallow);">
                    <div class="flex space-between">
                        <span style="color: var(--secondary-text-color);">ត្រូវបង់សរុប</span>
                        <span style="font-weight: bold;">៛ {{ payment?.totalAmountToPay ?? 0 }}</span>
                    </div>
                    <div class="flex space-between">
                        <span style="color: var(--secondary-text-color);">បានបង់រួចហើយ</span>
                        <span style="font-weight: bold; color: #16a34a;">៛ {{ payment?.totalAmountPaid ?? 0 }}</span>
                    </div>
                    <div style="border-top: 1px solid var(--border-color); margin: 4px 0;" />
                    <div class="flex space-between">
                        <span style="color: var(--secondary-text-color);">នៅសល់ត្រូវបង់</span>
                        <span style="font-weight: bold; color: var(--negative-color);">៛ {{ (payment?.totalAmountToPay ?? 0) - (payment?.totalAmountPaid ?? 0) }}</span>
                    </div>
                </div>

                <!-- Amount input -->
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-size: 14px; color: var(--secondary-text-color);">ចំនួនទឹកប្រាក់ដែលបង់ (៛)</label>
                    <input
                        type="number"
                        class="input"
                        v-model="amountPaying"
                        min="0"
                        :max="(payment?.totalAmountToPay ?? 0) - (payment?.totalAmountPaid ?? 0)"
                        style="font-size: 20px; font-weight: bold; text-align: right;"
                    />
                </div>

                <!-- Actions -->
                <div class="flex" style="gap: 10px; justify-content: flex-end;">
                    <div class="button small" @click="isShowPaymentPopup = false">បោះបង់</div>
                    <div class="button small" style="background-color: var(--primary-color); color: white;" @click="confirmPayment">✔ បញ្ជាក់ការបង់ប្រាក់</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.payment-detail-page {
    display: flex;
    flex-direction: column;
}

.content-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Status Banner */
.status-banner {
    border-left: 5px solid var(--border-color);
}
.status-banner.paid {
    border-left-color: #16a34a;
}
.status-banner.unpaid {
    border-left-color: var(--negative-color);
}
.status-banner.partial {
    border-left-color: #eab308;
}

.status-icon {
    font-size: 28px;
}
.status-label {
    font-size: 13px;
    color: var(--secondary-text-color);
    margin: 0;
}
.status-value {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}

/* Section title */
.section-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: var(--secondary-text-color);
    font-weight: 600;
}

/* Period row */
.info-row {
    display: flex;
    align-items: center;
    gap: 20px;
}
.divider-arrow {
    font-size: 20px;
    color: var(--secondary-text-color);
    padding-top: 16px;
}

/* Info items */
.info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.info-label {
    font-size: 13px;
    color: var(--secondary-text-color);
    margin: 0;
}
.info-value {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}
.info-value.small {
    font-size: 14px;
}

/* Breakdown table */
.breakdown-table {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.breakdown-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 8px;
    background-color: var(--back-color);
    box-shadow: var(--dented-shadow-shallow);
}
.breakdown-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 500;
}
.breakdown-icon {
    font-size: 18px;
}
.breakdown-detail {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}
.breakdown-sub {
    font-size: 12px;
    color: var(--secondary-text-color);
}
.breakdown-value {
    font-size: 16px;
    font-weight: bold;
}
.breakdown-divider {
    border-top: 1px solid var(--border-color);
    margin: 4px 0;
}
.total-row {
    background: none;
    box-shadow: none;
    padding: 4px 14px;
}
.total-value {
    font-size: 22px;
    color: var(--primary-color);
}

/* Colors */
.positive {
    color: #16a34a;
}
.negative {
    color: var(--negative-color);
}

/* Meta grid */
.meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.timestamps-card .meta-grid {
    grid-template-columns: repeat(2, 1fr);
}
</style>
