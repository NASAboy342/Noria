<template>
    <div class="flex colomn align-center">
        <div class="loading-box">
            <div class="card loading-spinner"></div>
            <div class="card loading-spinner1"></div>
            <div class="card loading-spinner2"></div>
            <div class="card loading-spinner3"></div>
        </div>
        <p>កំពុងដំណើរការ...</p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loading-box {
    padding: 20px;
    width: fit-content;
    height: fit-content;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.loading-spinner {
    border-radius: 100% !important;
    width: 5px;
    height: 5px;
    animation: jumping 1s linear infinite;
}

.loading-spinner1 {
    border-radius: 100% !important;
    width: 5px;
    height: 5px;
    animation: jumping1 1s linear infinite;
    animation-delay: 0.25s;
}
.loading-spinner2 {
    border-radius: 100% !important;
    width: 5px;
    height: 5px;
    animation: jumping2 1s linear infinite;
    animation-delay: 0.5s;
}
.loading-spinner3 {
    border-radius: 100% !important;
    width: 5px;
    height: 5px;
    animation: jumping3 1s linear infinite;
    animation-delay: 0.75s;
}

@keyframes jumping {
    0% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0); }
}
@keyframes jumping1 {
    0% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0); }
}
@keyframes jumping2 {
    0% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0); }
}
@keyframes jumping3 {
    0% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0); }
}
</style>