<template>
    <button type="submit" :class="['py-2 px-4 rounded-xl cursor-pointer dark:bg-[#3abdf7] bg-[#419400] text-[#010800] dark:hover:bg-[#59ccfe] hover:bg-[#53be00] dark:active:bg-[#0ab4fc] active:bg-[#4bae00] md:px-6 md:py-4 md:text-xl',
        noMargin ? 'self-center' : 'self-end mt-4 mr-4'
    ]">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    noMargin?: boolean
}>()
</script>