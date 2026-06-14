import { loadStats, saveStats, statsErrors } from '@/api/statsApi';
import { ref } from 'vue';


export const steps = ref('')
export const burnedCalories = ref('')
export const waterMl = ref('')
export const todayStats = ref({
    steps: 0,
    burned_calories: 0,
    water_ml: 0,
})

const selectedDate = ref(
    new Date().toLocaleDateString('en-CA')
)


export async function refreshStats() {
    const freshData = await loadStats(selectedDate.value);
    todayStats.value = {
        steps: freshData?.steps ?? 0,
        burned_calories: freshData?.burned_calories ?? 0,
        water_ml: freshData?.water_ml ?? 0
    };
}

export async function saveSteps() {
    if (steps.value === '' || statsErrors.value.steps) return;
    
    await saveStats({
        summary_date: selectedDate.value,
        steps: Number(steps.value),
        burned_calories: todayStats.value?.burned_calories || 0,
        water_ml: todayStats.value?.water_ml || 0
    });
    
    steps.value = '';
    await refreshStats()
}


export async function saveWater() {
    if (waterMl.value === '' || statsErrors.value.water_ml) return;
    
    const currentWater = todayStats.value?.water_ml || 0;
    const newWater = currentWater + Number(waterMl.value);

    await saveStats({
        summary_date: selectedDate.value,
        steps: todayStats.value?.steps || 0,
        burned_calories: todayStats.value?.burned_calories || 0,
        water_ml: newWater
    });
    
    waterMl.value = '';
    await refreshStats()
}

export async function saveBurned() {
    if (burnedCalories.value === '' || statsErrors.value.burned_calories) return;
    
    const currentCalories = todayStats.value?.burned_calories || 0
    const newCalories = currentCalories + Number(burnedCalories.value)

    await saveStats({
        summary_date: selectedDate.value,
        steps: todayStats.value?.steps || 0,
        burned_calories: newCalories,
        water_ml: todayStats.value?.water_ml || 0
    });
    
    burnedCalories.value = '';
    await refreshStats()
}