<template>
    <p :v-if="vif" class="text-[#fb7085] ml-2 my-2"><slot></slot></p>
</template>

<script setup lang="ts">
    defineProps<{
        vif?: string
    }>()
</script>