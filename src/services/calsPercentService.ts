import { summaryMeal } from "@/api/mealsApi";
import { computed } from "vue";
import { targetCalories } from "./calories";
import { useAuthStore } from "@/stores/authstore";

export const calsPercent = computed(() => {
    const auth = useAuthStore()
    const totalCals = summaryMeal.value.totalCalories
    const calsLimit = targetCalories(auth.user?.goal).toFixed(0);

    const percent = (Number(totalCals) / (Number(calsLimit) / 100));

    return percent
})