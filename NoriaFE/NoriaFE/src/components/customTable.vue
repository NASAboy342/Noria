<template>
    <div class="card">
        <table>
            <thead>
                <tr>
                    <th v-for="(key, index) in keys" :key="index">{{ key }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(element, index) in props.objects" :key="index">
                    <td v-for="key in keys" :key="key">{{ element[key] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { Room } from '../models/room';

const props = defineProps<{
    objects: Room[];
}>();
const keys = ref<string[]>([]);
const updateKeys = () => {
    keys.value = Object.keys(props.objects[0] || {});
    console.log("Received objects:", props.objects);
    console.log("Extracted keys:", keys.value);
};
onMounted(() => {
    updateKeys()
});
watch(() => props.objects, () => {
    updateKeys();
}, { deep: true });
</script>