<template>
    <button class="border-3 px-2 py-1 rounded-xl cursor-pointer dark:text-[#c9cbd0] dark:border-[#fb7085] border-[#efc6c2] dark:hover:bg-[#fb7085] hover:shadow-[0_0_20px_#efc6c2] active:shadow-[0_0_20px_#efc6c2] dark:hover:shadow-[0_0_20px_#fb7085] dark:active:shadow-[0_0_20px_#fb7085] dark:hover:text-[#150406] hover:bg-[#efc6c2] dark:active:bg-[#fc4863] active:bg-[#f0948c] dark:active:border-[#fc4863] active:border-[#f0948c] md:text-xl transition-colors duration-100" @click="click"
    :class="customClass">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    click?: () => void
    customClass?: string
}>()
</script>