<template>
    <div class="card table-card">
        <div class="table-wrap">
            <table class="data-table">
            <thead>
                <tr>
                    <th v-for="(key, index) in keys" :key="`${String(key)}-${index}`">{{ formatHeader(String(key)) }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(element, index) in props.objects" :key="index" @click="$emit('row-click', element)">
                    <td v-for="key in keys" :key="String(key)">{{ element[key] }}</td>
                </tr>
                <tr v-if="props.objects.length === 0">
                    <td class="empty-cell" :colspan="keys.length || 1">No data</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>
<script setup lang="ts">

import { computed } from 'vue';
import { Room } from '../models/room';

const props = defineProps<{
    objects: Room[];
}>();

const keys = computed<(keyof Room)[]>(() => {
    const first = props.objects[0];
    return first ? (Object.keys(first) as (keyof Room)[]) : [];
});

const formatHeader = (key: string) => {
    return key
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/^./, (char) => char.toUpperCase());
};


</script>

<style scoped>
.table-card {
    padding: 0;
}

.table-wrap {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 20px;
    color: var( --secondary-text-color);
}

.data-table thead th {
    text-align: left;
    font-weight: 700;
    font-size: 20px;
    padding: 28px 26px 20px;
    border-bottom: 2px solid var(--border-color);
    color: var(--primary-text-color);
}

.data-table tbody td {
    padding: 20px 26px;
    border-bottom: 2px solid var(--border-color);
}

.data-table tbody tr:nth-child(even) {
    background-color: var(--back-color);
}

.empty-cell {
    text-align: center;
    color: var(--secondary-text-color);
    font-style: italic;
}
  .data-table tbody tr:hover {
        background-color: var(--fourth-color);
        cursor: pointer;
    }

@media (max-width: 768px) {
    .data-table {
        font-size: 16px;
    }

    .data-table thead th {
        font-size: 20px;
        padding: 18px 14px 12px;
    }

    .data-table tbody td {
        padding: 14px;
    }
  
}

</style>