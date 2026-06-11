<template>
    <div v-if="meals && meals.length" class="border p-4 rounded-xl my-4 border-[#cbcfc3] dark:border-[#1e293b]">
        <h3 class="text-xl font-semibold mb-4 dark:text-white md:text-2xl">{{ title }}</h3>

        <MealItem v-for="meal in meals" :key="meal.mid" :name="meal.meal_name" :calories="meal.calories"
            :proteins="meal.proteins" :fats="meal.fats" :carbs="meal.carbs" />
    </div>
</template>

<script setup lang="ts">
import MealItem from './MealItem.vue'

interface MealData {
    mid: number | string
    meal_name: string
    calories: number | string
    proteins: number | string
    fats: number | string
    carbs: number | string
}

defineProps<{
    title: string
    meals: MealData[]
}>()
</script>