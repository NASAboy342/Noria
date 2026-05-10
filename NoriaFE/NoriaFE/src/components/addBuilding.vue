<template>
    <div>
        <div class="component-header">
        <h1 style="margin-top: 0px;">🏢 អគារថ្មី</h1>
        <p style="color: var(--secondary-text-color);">សូមបញ្ចូលព័ត៌មានអគារថ្មី</p>
        </div>

        <div class="component-content">
            <div class="form-group">
                <p>ឈ្មោះអគារ *</p>
                <input v-model="formData.name" type="text" placeholder="ឈ្មោះអគារ" class="input" required />
            </div>
            <div class="form-group">
                <p>អាសយដ្ឋាន *</p>
                <input v-model="formData.address" type="text" placeholder="អាសយដ្ឋាន" class="input" required />
            </div>
            <div class="form-group">
                <p>រូបភាព</p>
                <input v-model="formData.img" type="text" placeholder="តំណភ្ជាប់រូបភាព" class="input" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <p>ចំនួនជាន់</p>
                    <input v-model.number="formData.floors" type="number" placeholder="0" class="input" />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <p>តម្លៃអគ្គិសនីក្នុង ៛ ១kWh</p>
                    <input v-model.number="formData.electricityPricePerUnit" type="number" placeholder="0" step="0.01" class="input" />
                </div>
                <div class="form-group">
                    <p>តម្លៃទឹកក្នុង ៛ ១m³</p>
                    <input v-model.number="formData.waterPricePerUnit" type="number" placeholder="0" step="0.01" class="input" />
                </div>
            </div>
        </div>

        <div class="component-footer flex align-right">
            <div class="button negative" @click="$emit('close')">⌫ បកក្រោយ</div>
            <div class="button" @click="handleSave">✔ រក្សាទុក</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Building } from "../models/building";
import useApi from "../composables/useApi";
import { ref } from "vue";
import { useLoadingStore } from "../stores/loadingStore";

const loadingStore = useLoadingStore()
const formData = ref<Building>(new Building());

const emit = defineEmits<{
    (e: "close"): void;
}>();

const handleSave = async () => {
    try{
        loadingStore.startLoading("កំពុងរក្សាទុកព័ត៌មានអគារ...");
        console.log("Saving building:", formData.value);
        await useApi().addBuilding(formData.value);
    } finally {
        loadingStore.stopLoading();
        emit('close');
    }
};

</script>

<style scoped>
.component-footer{
    position: relative;
    margin-top: 20px;
}
.component-header{
    margin-bottom: 20px;
}
.component-content{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.form-group{
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--secondary-text-color);
}
.form-group p{
    margin: 0;
    font-size: 14px;
    font-weight: 500;
}
.form-row{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}
</style>