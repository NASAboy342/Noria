<script setup lang="ts">
import { ref, watch } from "vue";
import { AddRoomPayload } from "../models/addRoomPayload";
import { RoomUsage } from "../models/roomUsage";
import { Building } from "../models/building";
import useApi from "../composables/useApi";
import { useLoadingStore } from "../stores/loadingStore";

const startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 10));
const startYear = startDate.value.getFullYear();
const startMonth = startDate.value.getMonth();
const startDay = startDate.value.getDate();
const endDate = ref(new Date(new Date().getFullYear(), new Date().getMonth()+1, 10));
const endYear = endDate.value.getFullYear();
const endMonth = endDate.value.getMonth();
const endDay = endDate.value.getDate();
const newPayment = ref<RoomUsage>(new RoomUsage());
const loadingStore = useLoadingStore();

const props = defineProps<{
    room?: AddRoomPayload | null;
    lastRoomUsage?: RoomUsage | null;
    building?: Building | null;
}>();

watch(() => props.room, (newRoom) => {
    if(newRoom){
        // Initialize newPayment with default values based on the room and last usage
        newPayment.value.roomId = newRoom.id;
    }
}, { immediate: true });

watch(() => newPayment.value.waterUsage, (newVal) => {
    if (props.building) {
        newPayment.value.waterPrice = newVal * (props.building.waterPricePerUnit || 0);
        newPayment.value.totalAmountToPay = (newPayment.value.waterPrice || 0) + (newPayment.value.electricityPrice || 0) + (props.room?.price || 0);
    }
});

watch(() => newPayment.value.electricityUsage, (newVal) => {
    if (props.building) {
        newPayment.value.electricityPrice = newVal * (props.building.electricityPricePerUnit || 0);
        newPayment.value.totalAmountToPay = (newPayment.value.waterPrice || 0) + (newPayment.value.electricityPrice || 0) + (props.room?.price || 0);
    }
});

const emit = defineEmits<{
    (e: "close"): void;
    (e: "paymentCreated"): void;
}>();

const createPayment = async () => {
    try{
        loadingStore.startLoading("កំពុងរក្សាទុកវិក្កយបត្រ...");
        newPayment.value.startTime = new Date(startYear, startMonth, startDay).toISOString();
        newPayment.value.endTime = new Date(endYear, endMonth, endDay).toISOString();
        newPayment.value.createdOn = new Date().toISOString();
        newPayment.value.updatedOn = new Date().toISOString();
        newPayment.value.paidOn = new Date().toISOString();
        await useApi().createPayment(newPayment.value);
        emit('paymentCreated');
        emit('close');
    }
    finally{
        loadingStore.stopLoading();
    }
}
</script>

<template>
    <div class="container">
        <div class="header">
                <h1 style="margin-top: unset;">វិក្កយបត្រ បន្ទប់+ទឹក+ភ្លើង</h1>
        </div>
        <div class="content">
            <div class="flex" style=" color: var(--secondary-text-color);">
                <div class="flex">
                    <p>លេខទូរស័ព្ទ</p>
                    <input type="text" class="input" :value="props.room?.phoneNumber || ''" />
                </div>
                <div class="flex">
                    <p>បន្ទប់លេខ</p>
                    <input type="text" class="input" :value="props.room?.name || ''" />
                </div>
            </div>
            <div class="flex" style=" color: var(--secondary-text-color);">
                <div class="flex">
                    <p>គិតចាប់ពីថ្ងៃទី</p>
                    <input type="text" class="input" style="width: 30px;" v-model="startDay" />
                </div>
                <div class="flex">
                    <p>ខែ</p>
                    <input type="text" class="input" style="width: 30px;" v-model="startMonth" />
                </div>
                <div class="flex">
                    <p>ឆ្នាំ</p>
                    <input type="text" class="input" style="width: 30px;" v-model="startYear" />
                </div>
                <div class="flex">
                    <p>ដល់ថ្ងៃទី</p>
                    <input type="text" class="input" style="width: 30px;" v-model="endDay" />
                </div>
                <div class="flex">
                    <p>ខែ</p>
                    <input type="text" class="input" style="width: 30px;" v-model="endMonth" />
                </div>
                <div class="flex">
                    <p>ឆ្នាំ</p>
                    <input type="text" class="input" style="width: 30px;" v-model="endYear" />
                </div>
            </div>
            <div class="table-wrap">
                <table>
                    <tbody>
                        <tr style=" color: var(--secondary-text-color);">
                            <td>
                                <p>លេខកត់ត្រាទឹក</p>
                                <div class="flex">
                                    <div>
                                        <p>លេខថ្មី</p>
                                        <input type="number" class="input" style="margin-top: 5px;" v-model="newPayment.waterUsage"/>
                                    </div>
                                    <div>
                                        <p>លេខចាស់</p>
                                        <input type="text" class="input" style="margin-top: 5px;" :value="props.lastRoomUsage?.waterUsage || 0" readonly/>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួនm3</p>
                                    <input type="text" class="input" :value="newPayment.waterUsage - (props.lastRoomUsage?.waterUsage || 0)" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួន1m3</p>
                                    <input type="text" class="input" :value="props.building?.waterPricePerUnit || 0" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ថ្លៃទឹកសរុប</p>
                                    <input type="text" class="input" :value="newPayment.waterPrice" readonly/>
                                </div>
                            </td>
                        </tr>
                        <tr style=" color: var(--secondary-text-color);">
                            <td>
                                <p>លេខកត់ត្រាភ្លើង</p>
                                <div class="flex">
                                    <div>
                                        <p>លេខថ្មី</p>
                                        <input type="number" class="input" style="margin-top: 5px;" v-model="newPayment.electricityUsage"/>
                                    </div>
                                    <div>
                                        <p>លេខចាស់</p>
                                        <input type="text" class="input" style="margin-top: 5px;" :value="props.lastRoomUsage?.electricityUsage || 0" readonly/>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួនKw</p>
                                    <input type="text" class="input" :value="newPayment.electricityUsage - (props.lastRoomUsage?.electricityUsage || 0)" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួន1Kw</p>
                                    <input type="text" class="input" :value="props.building?.electricityPricePerUnit || 0" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ថ្លៃភ្លើងសរុប</p>
                                    <input type="text" class="input" :value="newPayment.electricityPrice" readonly/>
                                </div>
                            </td>
                        </tr>
                        <tr style=" color: var(--secondary-text-color);">
                            <td>
                                <div class="">
                                    <p>តំលៃបន្ទប់ជួល</p>
                                    <input type="text" class="input" style="margin-top: 5px;" :value="props.room?.price || 0" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>តំលៃបន្ទប់សរុប</p>
                                    <input type="text" class="input" :value="props.room?.price || 0" readonly/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <div class="flex center">
                                    <h3>តំលៃសរុបទាំងអស់</h3>
                                </div>
                            </td>
                            <td>
                                <div class="flex center">
                                    <h3>{{ newPayment.totalAmountToPay }}</h3>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="footer">
            <div class="button negative" @click="emit('close')">⌫ បកក្រោយ</div>
            <div class="button" @click="createPayment">✔ រក្សាទុក</div>
            <div class="button" @click="emit('close')">🖨 ព្រីន</div>
        </div>
    </div>
</template>

<style scoped lang="css">
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 10px;
}
.header{
    display: flex;
    justify-content: center;
}
.footer{
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
.content{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
table{
    border: 1px solid var(--border-color);
    border-collapse: collapse;
    width: 100%;
}
tr{
    border: 1px solid var(--border-color);
}
td{
    border: 1px solid var(--border-color);
    height: 100px;
    padding: 10px;
}
td input{
    height: 20px;
}
.table-wrap{
    display: flex;
    justify-content: center;
}
</style>