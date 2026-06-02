<template>
    <RouterLink class="text-[#343300] dark:text-[#cdd0d4] w-fit font-medium dark:hover:text-[#2d93bf] dark:active:text-[#3abdf7] hover:text-[#347800] active:text-[#419400] transition-colors duration-100" :to="to">
        <slot />
    </RouterLink>
</template>

<script setup lang="ts">
    defineProps<{
        to: string,
    }>()
</script>