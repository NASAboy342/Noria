<template>
    <div>
        <div class="component-header">
            <h1 style="margin-top: 0px;">🛏️ បន្ថែមបន្ទប់ថ្មី</h1>
            <p style="color: var(--secondary-text-color);">សូមបញ្ចូលព័ត៌មានបន្ទប់ថ្មី</p>
        </div>

        <div class="component-content">
            <div class="form-group">
                <p>ឈ្មោះបន្ទប់</p>
                <input v-model="form.name" type="text" placeholder="ឈ្មោះបន្ទប់" class="input" />
            </div>
            <div class="form-group">
                <p>លេខទូរស័ព្ទ</p>
                <input v-model="form.phoneNumber" type="text" placeholder="លេខទូរស័ព្ទ" class="input" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <p>ជាន់ទី</p>
                    <input v-model.number="form.floor" type="number" placeholder="0" class="input" />
                </div>
                <div class="form-group">
                    <p>តម្លៃបន្ទប់ គឺជា($)</p>
                    <input v-model.number="form.price" type="number" placeholder="0" class="input" />
                </div>
            </div>
            <div class="form-group">
                <p>មានអ្នកស្នាក់</p>
                <select v-model="form.isOccupied" class="input">
                    <option :value="true">មាន</option>
                    <option :value="false">គ្មាន</option>
                </select>
            </div>
        </div>

        <div class="component-footer flex align-right">
            <div class="button negative" @click="emit('close')">⌫ បកក្រោយ</div>
            <div class="button" @click="addRoom">✔ បន្ថែម</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { AddRoomPayload } from "../models/addRoomPayload";
import useApi from "../composables/useApi";
import { useLoadingStore } from "../stores/loadingStore";

const loadingStore = useLoadingStore()
const props = defineProps<{
    buildingId?: number
}>()

const emit = defineEmits<{
    (e: "close"): void;
    (e: "add"): void;
}>()

const form = reactive<AddRoomPayload>(Object.assign(new AddRoomPayload(), { buildingId: props.buildingId ?? 0 }))

const addRoom = async () => {
    try{
        loadingStore.startLoading('កំពុងបន្ថែមបន្ទប់ថ្មី...');
        await useApi().addRoom(form);
        emit('add');
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.component-footer {
    margin-top: 20px;
}
</style>
