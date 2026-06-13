<script setup lang="ts">
import { ref, watch } from "vue";
import { AddRoomPayload } from "../models/addRoomPayload";
import { RoomUsage } from "../models/roomUsage";
import { Building } from "../models/building";
import useApi from "../composables/useApi";
import { useLoadingStore } from "../stores/loadingStore";

const startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 10));
const startYear =  ref(startDate.value.getFullYear());
const startMonth = ref(startDate.value.getMonth());
const startDay = ref(startDate.value.getDate());
const endDate = ref(new Date(new Date().getFullYear(), new Date().getMonth()+1, 10));
const endYear = ref(endDate.value.getFullYear());
const endMonth = ref(endDate.value.getMonth());
const endDay = ref(endDate.value.getDate());
const loadingStore = useLoadingStore();
const room = ref<AddRoomPayload>(new AddRoomPayload());
const building = ref<Building>(new Building());
const targetRoomUsage = ref<RoomUsage>(new RoomUsage());
const lastRoomUsage = ref<RoomUsage>(new RoomUsage());

const props = defineProps<{
    //:paymentId="paymentId" :roomId="roomId" :buildingId="buildingId" @close="isShowPaymentUpdate = false"
    paymentId?: number;
    roomId?: number;
    buildingId?: number;
}>();

const calculateTotalAmountToPay = () => {
    if (targetRoomUsage.value && building.value && room.value) {

        var waterPrice = (targetRoomUsage.value.waterPrice || 0);
        var electricityPrice = (targetRoomUsage.value.electricityPrice || 0);
        var roomPriceInKHR = (room.value?.price || 0) * (building.value?.khrToUSDExchangeRate || 0);
        targetRoomUsage.value.totalAmountToPay = waterPrice + electricityPrice + roomPriceInKHR + (targetRoomUsage.value.adjustmentAmount || 0);
    }
}
const syncData = async () => {
    if (props.buildingId) {
        building.value = await useApi().getBuildingById(props.buildingId);
    }
    if (props.buildingId && props.roomId) {
        room.value = await useApi().getRoom(props.buildingId, props.roomId);
        if (props.paymentId) {
            targetRoomUsage.value = await useApi().getPaymentById(props.paymentId);
            startYear.value = new Date(targetRoomUsage.value.startTime).getFullYear();
            startMonth.value = new Date(targetRoomUsage.value.startTime).getMonth();
            startDay.value = new Date(targetRoomUsage.value.startTime).getDate();
            endYear.value = new Date(targetRoomUsage.value.endTime).getFullYear();
            endMonth.value = new Date(targetRoomUsage.value.endTime).getMonth();
            endDay.value = new Date(targetRoomUsage.value.endTime).getDate();
            lastRoomUsage.value = await useApi().getLastRoomUsage(props.buildingId, props.roomId, props.paymentId);
            calculateTotalAmountToPay();
        }
    }
}

watch(() => props.roomId, async (newRoomId) => {
    if (newRoomId && props.buildingId) {
        syncData();
    }
}, { immediate: true });

watch(() => props.buildingId, async (newBuildingId) => {
    if (newBuildingId && props.roomId) {
        syncData();
    }
}, { immediate: true });

watch(() => targetRoomUsage.value?.waterUsage, (newVal) => {
    if (building.value && targetRoomUsage.value && newVal !== undefined) {
        targetRoomUsage.value.waterPrice = newVal * (building.value.waterPricePerUnit || 0);
        calculateTotalAmountToPay();
    }
});

watch(() => targetRoomUsage.value?.electricityUsage, (newVal) => {
    if (building.value && targetRoomUsage.value && newVal !== undefined) {
        targetRoomUsage.value.electricityPrice = newVal * (building.value.electricityPricePerUnit || 0);
        calculateTotalAmountToPay();
    }
});

watch(() => targetRoomUsage.value?.adjustmentAmount, (newVal) => {
    if (targetRoomUsage.value && newVal !== undefined) {
        calculateTotalAmountToPay();
    }
});

const emit = defineEmits<{
    (e: "close"): void;
    (e: "paymentUpdated"): void;
}>();

const updatePayment = async () => {
    try{
        loadingStore.startLoading("កំពុងកែប្រែវិក្កយបត្រ...");
        if(targetRoomUsage.value){
            targetRoomUsage.value.startTime = new Date(startYear.value, startMonth.value-1, startDay.value).toISOString();
            targetRoomUsage.value.endTime = new Date(endYear.value, endMonth.value-1, endDay.value).toISOString();
            await useApi().updatePayment(targetRoomUsage.value);
        }
        emit('paymentUpdated');
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
                <h1 style="margin-top: unset;">កែសម្រួលវិក្កយបត្រ បន្ទប់+ទឹក+ភ្លើង</h1>
        </div>
        <div class="content">
            <div class="flex" style=" color: var(--secondary-text-color);">
                <div class="flex">
                    <p>លេខទូរស័ព្ទ</p>
                    <input type="text" class="input" :value="room?.phoneNumber || ''" />
                </div>
                <div class="flex">
                    <p>បន្ទប់លេខ</p>
                    <input type="text" class="input" :value="room?.name || ''" />
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
                                        <input type="number" class="input" style="margin-top: 5px;" v-model="targetRoomUsage.waterUsage"/>
                                    </div>
                                    <div>
                                        <p>លេខចាស់</p>
                                        <input type="text" class="input" style="margin-top: 5px;" :value="lastRoomUsage?.waterUsage || 0" readonly/>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួនm3</p>
                                    <input type="text" class="input" :value="targetRoomUsage.waterUsage - (lastRoomUsage?.waterUsage || 0)" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួន1m3</p>
                                    <input type="text" class="input" :value="(building?.waterPricePerUnit || 0) + ' ៛'" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ថ្លៃទឹកសរុប</p>
                                    <input type="text" class="input" :value="targetRoomUsage.waterPrice + ' ៛'" readonly/>
                                </div>
                            </td>
                        </tr>
                        <tr style=" color: var(--secondary-text-color);">
                            <td>
                                <p>លេខកត់ត្រាភ្លើង</p>
                                <div class="flex">
                                    <div>
                                        <p>លេខថ្មី</p>
                                        <input type="number" class="input" style="margin-top: 5px;" v-model="targetRoomUsage.electricityUsage"/>
                                    </div>
                                    <div>
                                        <p>លេខចាស់</p>
                                        <input type="text" class="input" style="margin-top: 5px;" :value="lastRoomUsage?.electricityUsage || 0" readonly/>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួនKw</p>
                                    <input type="text" class="input" :value="targetRoomUsage.electricityUsage - (lastRoomUsage?.electricityUsage || 0)" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួន1Kw</p>
                                    <input type="text" class="input" :value="(building?.electricityPricePerUnit || 0) + ' ៛'" readonly/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ថ្លៃភ្លើងសរុប</p>
                                    <input type="text" class="input" :value="targetRoomUsage.electricityPrice + ' ៛'" readonly/>
                                </div>
                            </td>
                        </tr>
                        <tr style=" color: var(--secondary-text-color);">
                            <td>
                                <div class="">
                                    <p>តំលៃបន្ទប់ជួល</p>
                                    <input type="text" class="input" style="margin-top: 5px;" :value="(room?.price || 0) + ' $'" readonly/>
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
                                    <input type="text" class="input" :value="(room?.price || 0) + ' $ / ' + ((room?.price || 0) * (building?.khrToUSDExchangeRate || 0)) + ' ៛'" readonly/>
                                    <p>តំលៃកែសម្រួល ៛</p>
                                    <input type="number" class="input" v-model="targetRoomUsage.adjustmentAmount"/>
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
                                    <h3>{{ targetRoomUsage.totalAmountToPay + ' ៛'}}</h3>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="footer">
            <div class="button negative" @click="emit('close')">⌫ បកក្រោយ</div>
            <div class="button" @click="updatePayment">✔ រក្សាទុក</div>
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