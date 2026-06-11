<template>
    <div
        class="bg-[#cbcfc3] dark:bg-[#0f172a] dark:text-[#c9cbd0] rounded-xl my-2 p-2 md:flex md:justify-between md:items-center">
        <div>
            <p class="text-xl font-bold md:text-2xl">{{ name }}</p>
            <p class="font-light md:text-xl">Калорийность: {{ calories }} ккал</p>
        </div>
        <div class="hidden md:block w-60 bg-[#f8fdef] dark:bg-[#0a1120] p-2 rounded-xl text-center">
            <p class="text-xl font-light">Белки: {{ proteins }} г</p>
            <p class="text-xl font-light">Жиры: {{ fats }} г</p>
            <p class="text-xl font-light">Углеводы: {{ carbs }} г</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string
    calories: number | string
    proteins: number | string
    fats: number | string
    carbs: number | string
}>()
</script>