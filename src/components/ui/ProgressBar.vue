<template>
    <div class="w-80 p-6 bg-[#f8fdef] dark:bg-[#0a1120] rounded-xl md:w-3xl md:mt-2 lg:w-5xl">
        <div class="flex h-7 bg-[#cbcfc3] dark:bg-[#13203a] rounded-xl md:h-10">
            <div class="bg-[#419400] dark:bg-[#3abdf7] rounded-xl transition-all duration-100"
                :style="style">

            </div>
        </div>
        <p class="ml-2 mt-2 font-semibold dark:text-[#c9cbd0] md:text-2xl"><slot></slot></p>
    </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue';

defineProps<{
    style: StyleValue
}>()
</script>