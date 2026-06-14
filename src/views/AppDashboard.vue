<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormInput from '@/components/ui/FormInput.vue';
import NextStepBtn from '@/components/ui/NextStepBtn.vue';
import DefaultLayout from '@/layout/DefaultLayout.vue';
import { fetchWeightHistory, submitWeight, weightIssueMessage } from '@/api/weightApi';
import { targetCalories } from '@/services/calories';
import { statsErrors } from '@/api/statsApi';
import DefaultSection from '@/components/ui/DefaultSection.vue';
import WeightChart from '@/components/charts/WeightChart.vue';
import { weights } from '@/api/weightApi';
import { useAuthStore } from '@/stores/authstore';
import { loadSummaryMeal, summaryMeal } from '@/api/mealsApi';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import StatsCard from '@/components/ui/StatsCard.vue';
import { burnedCalories, refreshStats, saveBurned, saveSteps, saveWater, steps, todayStats, waterMl } from '@/services/todayStatsService';
import { calsPercent } from '@/services/calsPercentService';
import { ciloPercentLoss, ciloPercentPross, startWeight, userCurrentWeight } from '@/services/ciloPercentService';
import { waterTarget } from '@/services/recomendWaterService';
import { stepsTarget } from '@/services/stepsGoalService';

const auth = useAuthStore()

const currentWeight = ref('')


const selectedDate = ref(
    new Date().toLocaleDateString('en-CA')
)

async function handleSubmitWeight() {
    await submitWeight(Number(currentWeight.value))
    weights.value = await fetchWeightHistory()
    currentWeight.value = ''
    await updateWeightData()
}

async function updateWeightData() {
    const history = await fetchWeightHistory()
    weights.value = history

    if (history && history.length > 0) {
        startWeight.value = auth.user?.userStartWeight ?? 0
        userCurrentWeight.value = history.at(-1)?.weight ?? 0
    }
}

async function handleSaveSteps() {
    await saveSteps()
}

async function handleSaveBurned() {
    await saveBurned()
}

async function handleSaveWater() {
    await saveWater()
}

onMounted(async () => {
    await updateWeightData()
    await refreshStats()
    summaryMeal.value = await loadSummaryMeal(selectedDate.value)
})
</script>

<template>
    <DefaultLayout>
        <section class="flex flex-col gap-3 w-90 items-center md:w-3xl lg:w-5xl">
            <h2 class="text-xl dark:text-[#c9cbd0] w-75 font-bold md:text-left md:text-3xl md:w-3xl lg:w-5xl">Мой
                прогресс</h2>
            <ProgressBar :style="{ width: calsPercent + '%' }">
                {{ summaryMeal.totalCalories ? summaryMeal.totalCalories : 0 }} / {{
                    targetCalories(auth.user?.goal).toFixed(0) }} Ккал
            </ProgressBar>
            <ProgressBar v-if="auth.user?.goal !== 'weightMaintenance'"
                :style="{ width: auth.user?.goal === 'fit' ? ciloPercentLoss + '%' : ciloPercentPross + '%' }">
                <span v-if="auth.user?.goal === 'fit'">
                    {{ auth.user.userStartWeight - userCurrentWeight > 0 ? (auth.user.userStartWeight -
                        userCurrentWeight).toFixed(2) : 0 }} / {{ (auth.user.userStartWeight -
                        auth.user.goalWeight).toFixed(2) }} Кг сброшено
                </span>
                <span v-if="auth.user?.goal === 'bodyBuild'">
                    {{ (userCurrentWeight - auth.user.userStartWeight) > 0 ? (userCurrentWeight -
                        auth.user.userStartWeight).toFixed(2) : 0 }} / {{ (auth.user.goalWeight -
                        auth.user.userStartWeight).toFixed(2) }} Кг набранно
                </span>
            </ProgressBar>
        </section>

        <section class="w-90 md:w-3xl lg:w-5xl px-2 mt-6">
            <h2 class="text-xl dark:text-[#c9cbd0] w-75 font-bold md:text-left md:text-3xl md:w-3xl lg:w-5xl lg:mb-6">
                Обновить показатели</h2>
            <div class="flex flex-col md:flex-row gap-3 md:gap-2 lg:gap-3">
                <StatsCard v-model="steps" title="Шаги за сегодня" btnText="Сохранить" inputId="stepsCardInput"
                    inputName="steps" placeholder="+ шаги" :min="0" :max="200000"
                    @validation="statsErrors.steps = $event" @submit="handleSaveSteps">
                    <template #displayValue>
                        <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-black text-gray-800 dark:text-[#c9cbd0]">
                                {{ todayStats.steps }}
                            </span>
                            <span class="text-sm text-gray-400 font-medium">/ {{ stepsTarget }}</span>
                        </div>
                    </template>
                </StatsCard>

                <StatsCard v-model="waterMl" title="Добавить запись воды" btnText="Сохранить" inputId="waterCardInput"
                    inputName="water" placeholder="+ миллилитры" :min="0" :max="15000"
                    @validation="statsErrors.water_ml = $event" @submit="handleSaveWater">
                    <template #displayValue>
                        <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-black text-gray-800 dark:text-[#c9cbd0]">
                                {{ todayStats.water_ml }}
                            </span>
                            <span class="text-sm text-gray-400 font-medium">/ {{ waterTarget }} мл воды</span>
                        </div>
                    </template>
                </StatsCard>

                <StatsCard v-model="burnedCalories" title="Сожжено калорий" btnText="Сохранить"
                    inputId="burnedCardInput" inputName="burned" placeholder="+ калории" :min="0" :max="10000"
                    @validation="statsErrors.burned_calories = $event" @submit="handleSaveBurned">
                    <template #displayValue>
                        <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-black text-gray-800 dark:text-[#c9cbd0]">
                                {{ todayStats.burned_calories }}
                            </span>
                            <span class="text-sm text-gray-400 font-medium">Калорий</span>
                        </div>
                    </template>
                </StatsCard>
            </div>

        </section>

        <DefaultSection>
            <template #h2Header>
                Обновление веса
            </template>

            <template #mainContent>
                <form @submit.prevent="handleSubmitWeight" class="p-2 md:p-4">
                    <div>
                        <FormInput v-model="currentWeight" id="currentWeight" name="currentWeight"
                            placeholder="Введите вес в кг" type="number" max="250" min="0" step="0.01"
                            @validation="weightIssueMessage = $event">
                            <template #inputLabel>
                                Введите ваш текущий вес
                            </template>

                            <template #inputError v-if="weightIssueMessage">
                                {{ weightIssueMessage }}
                            </template>
                        </FormInput>
                    </div>

                    <NextStepBtn>
                        Отправить
                    </NextStepBtn>
                </form>
            </template>
        </DefaultSection>

        <WeightChart>

        </WeightChart>
    </DefaultLayout>
</template>