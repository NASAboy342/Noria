<template>
    <div>
        <div class="component-header">
            <h1 style="margin-top: 0px;">🏢 {{ form.name }}</h1>
            <p style="color: var(--secondary-text-color);">{{ form.address }}</p>
        </div>

        <div class="component-content">
            <img v-if="form.img" :src="form.img" class="building-img" alt="building image" />

            <div class="detail-grid">
                <div class="detail-item">
                    <p class="label">ឈ្មោះអគារ</p>
                    <input v-model="form.name" type="text" class="input" />
                </div>
                <div class="detail-item">
                    <p class="label">អាសយដ្ឋាន</p>
                    <input v-model="form.address" type="text" class="input" />
                </div>
                <div class="detail-item">
                    <p class="label">រូបភាព (URL)</p>
                    <input v-model="form.img" type="text" class="input" />
                </div>
                <div class="detail-item">
                    <p class="label">ចំនួនជាន់</p>
                    <input v-model.number="form.floors" type="number" class="input" />
                </div>
                <div class="detail-item">
                    <p class="label">ចំនួនបន្ទប់សរុប</p>
                    <input v-model.number="form.rooms" type="number" class="input" />
                </div>
                <div class="detail-item">
                    <p class="label">បន្ទប់មានអ្នកស្នាក់</p>
                    <input v-model.number="form.occupiedRooms" type="number" class="input" />
                </div>
                <div class="detail-item">
                    <p class="label">បន្ទប់បានបង់ប្រាក់</p>
                    <input v-model.number="form.paidRooms" type="number" class="input" />
                </div>
                <div class="detail-item">
                    <p class="label">តម្លៃអគ្គិសនី (១ kWh) ៛</p>
                    <input v-model.number="form.electricityPricePerUnit" type="number" class="input" />
                </div>
                <div class="detail-item">
                    <p class="label">តម្លៃទឹក (១ m³) ៛</p>
                    <input v-model.number="form.waterPricePerUnit" type="number" class="input" />
                </div>
            </div>
        </div>

        <div class="component-footer flex align-right">
            <div class="button negative" @click="$emit('close')">⌫ បិទ</div>
            <div class="button" @click="updateBuildingDetail">✔ កែប្រែ</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { Building } from "../models/building";
import { useLoadingStore } from "../stores/loadingStore";
import useApi from "../composables/useApi";

const loadingStore = useLoadingStore()
const props = defineProps<{
    building?: Building
}>()

const emit = defineEmits<{
    (e: "close"): void;
    (e: "updated"): void;
}>()

const form = reactive<Building>(Object.assign(new Building(), props.building))

watch(() => props.building, (val) => {
    Object.assign(form, val)
})

const updateBuildingDetail = async () => {
    try{
        loadingStore.startLoading("កំពុងរក្សាទុកព័ត៌មានអគារ...");
        await useApi().updateBuilding(form);
        emit("updated");
    }
    finally{
        loadingStore.stopLoading();
        emit("close");
    }
};
</script>

<style scoped>
.component-header {
    margin-bottom: 20px;
}

.building-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 16px;
}

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.label {
    margin: 0;
    font-size: 13px;
    color: var(--secondary-text-color);
}

.component-footer {
    margin-top: 20px;
}
</style>
