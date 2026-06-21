<template>
    <div>
        <div class="component-header">
            <h1 style="margin-top: 0px;">🛏️ ព័ត៌មានបន្ទប់</h1>
            <p style="color: var(--secondary-text-color);">សូមបញ្ចូលព័ត៌មានបន្ទប់ថ្មី</p>
        </div>

        <div class="component-content">
            <div class="form-group">
                <p>ឈ្មោះបន្ទប់</p>
                <input v-model="props.room.name" type="text" placeholder="ឈ្មោះបន្ទប់" class="input" />
            </div>
            <div class="form-group">
                <p>លេខទូរស័ព្ទ</p>
                <input v-model="props.room.phoneNumber" type="text" placeholder="លេខទូរស័ព្ទ" class="input" />
            </div>
            <div class="form-row">
                <div class="form-group" style="width: 48%;">
                    <p>ជាន់ទី</p>
                    <input v-model.number="props.room.floor" type="number" placeholder="0" class="input" />
                </div>
                <div class="form-group" style="width: 48%;">
                    <p>តម្លៃបន្ទប់ គឺជា($)</p>
                    <input v-model.number="props.room.price" type="number" placeholder="0" class="input" />
                </div>
            </div>
            <div class="form-group">
                <p>មានអ្នកស្នាក់</p>
                <select v-model="props.room.isOccupied" class="input">
                    <option :value="true">មាន</option>
                    <option :value="false">គ្មាន</option>
                </select>
            </div>
            <div class="form-group">
                <p>ប្រាក់ដែលត្រូវកក់ $</p>
                <input v-model.number="props.room.requiredDepositAmount" type="number" placeholder="ប្រាក់ដែលត្រូវកក់ $" class="input" />
            </div>
            <div class="form-group">
                <p>ប្រាក់ដែលបានកក់ $</p>
                <input v-model.number="props.room.deposit" type="number" placeholder="ប្រាក់ដែលបានកក់ $" class="input" />
            </div>
        </div>

        <div class="component-footer flex align-right">
            <div class="button negative" @click="emit('close')">⌫ បកក្រោយ</div>
            <div class="button" @click="updateRoom">✔ កែប្រែ</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { AddRoomPayload } from "../models/addRoomPayload";
import useApi from "../composables/useApi";
import { useLoadingStore } from "../stores/loadingStore";
import { Building } from "../models/building";

const loadingStore = useLoadingStore()
const props = defineProps<{
    room: AddRoomPayload;
    building: Building;
}>()

const emit = defineEmits<{
    (e: "close"): void;
    (e: "update"): void;
}>()

const updateRoom = async () => {
    try{
        loadingStore.startLoading('កំពុងកែប្រែព័ត៌មានបន្ទប់...');
        await useApi().updateRoom(props.room);
        emit('update');
    }
    finally{
        loadingStore.stopLoading();
        emit('close');
    }
}
</script>

<style scoped>
.component-header {
    margin-bottom: 20px;
}

.component-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-group p {
    margin: 0;
    font-size: 13px;
    color: var(--secondary-text-color);
}

.form-row {
    display: flex;
    justify-content: space-between;
}

.component-footer {
    margin-top: 20px;
}
</style>
