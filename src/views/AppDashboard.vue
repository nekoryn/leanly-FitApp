<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import FormInput from '@/components/ui/FormInput.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import DefaultLayout from '@/layout/DefaultLayout.vue';
    import { fetchWeightHistory, submitWeight, weightIssueMessage } from '@/api/weightApi';
    import { targetCalories } from '@/services/calories';
    import { loadStats, saveStats, isTodayStatsExist, statsErrors } from '@/api/statsApi';
    import DefaultSection from '@/components/ui/DefaultSection.vue';
    import WeightChart from '@/components/charts/WeightChart.vue';
    import { weights } from '@/api/weightApi';
    import { useAuthStore } from '@/stores/authstore';
    import { loadSummaryMeal, summaryMeal } from '@/api/mealsApi';
    import ProgressBar from '@/components/ui/ProgressBar.vue';

    const auth = useAuthStore()

    const currentWeight = ref('')

    const startWeight = ref(0)
    const userCurrentWeight = ref(0)

    const steps = ref('')
    const burnedCalories = ref('')
    const waterMl = ref('')
    const todayStats = ref({
        steps: 0,
        burned_calories: 0,
        water_ml: 0,
    })
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

    async function handleSubmitSummary() {
        await saveStats({
            summary_date: selectedDate.value,
            steps: Number(steps.value),
            burned_calories: Number(burnedCalories.value),
            water_ml: Number(waterMl.value)
        })

        todayStats.value = await loadStats(selectedDate.value)
    }

    const calsPercent = computed(() => {
        const totalCals = summaryMeal.value.totalCalories
        const calsLimit = targetCalories(auth.user?.goal).toFixed(0);

        const percent = (Number(totalCals) / (Number(calsLimit) / 100));

        return percent
    })

    const ciloPercentLoss = computed(() => {
        const startUserWeight = startWeight.value
        const currentWeight = userCurrentWeight.value
        const goalWeight = auth.user?.goalWeight ?? 0

        const percent = ((startUserWeight - currentWeight) / (startUserWeight - goalWeight)) * 100

        return percent > 0 ? percent : 0
    })

    const ciloPercentPross = computed(() => {
        const startUserWeight = startWeight.value
        const currentWeight = userCurrentWeight.value
        const goalWeight = auth.user?.goalWeight ?? 0 
        console.log(startUserWeight, currentWeight, goalWeight)

        const percent = ((currentWeight - startUserWeight) / (goalWeight - startUserWeight)) * 100

        console.log('PROSS',percent)
        return percent > 0 ? percent : 0
    })

    


    onMounted(async () => {
        await updateWeightData()
        todayStats.value = await loadStats(selectedDate.value)
        summaryMeal.value = await loadSummaryMeal(selectedDate.value)
    })
</script>

<template>
    <DefaultLayout>
        <section class="flex flex-col gap-3 w-90 items-center md:w-3xl lg:w-5xl">
            <h2 class="text-xl dark:text-[#c9cbd0] w-75 font-bold md:text-left md:text-3xl md:w-3xl lg:w-5xl">Мой прогресс</h2>
            <ProgressBar :style="{ width: calsPercent + '%'}">
                {{ summaryMeal.totalCalories ? summaryMeal.totalCalories : 0 }} / {{ targetCalories(auth.user?.goal).toFixed(0) }} Ккал
            </ProgressBar>
            <ProgressBar v-if="auth.user?.goal !== 'weightMaintenance'" :style="{ width: auth.user?.goal === 'fit' ? ciloPercentLoss + '%' : ciloPercentPross + '%'}">
                <span v-if="auth.user?.goal === 'fit'">
                    {{ auth.user.userStartWeight - userCurrentWeight > 0 ? auth.user.userStartWeight - userCurrentWeight : 0 }} / {{ auth.user.userStartWeight - auth.user.goalWeight }} Кг сброшено
                </span>
                <span v-if="auth.user?.goal === 'bodyBuild'">
                    {{ (userCurrentWeight - auth.user.userStartWeight) > 0 ? userCurrentWeight - auth.user.userStartWeight : 0}} / {{ auth.user.goalWeight - auth.user.userStartWeight }} Кг набранно
                </span>
            </ProgressBar>
        </section>

        <DefaultSection>
            <template #h2Header>
                Обновление веса
            </template>

            <template #mainContent>
                <form @submit.prevent="handleSubmitWeight" class="p-2 md:p-4">
                    <div>
                        <FormInput v-model="currentWeight" id="currentWeight" name="currentWeight" placeholder="Введите вес в кг" type="number" max="250" min="0" step="0.01" @validation="weightIssueMessage = $event">
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

        <DefaultSection>
            <template #h2Header>
                Подвести итоги дня
            </template>
            <template #mainContent>
                <form @submit.prevent="handleSubmitSummary" class="flex flex-col gap-2 p-2 md:p-4">
                    <div>
                        <FormInput v-model="steps" id="stepsCount" name="stepsCount" type="number" placeholder="Введите количество шагов" min="0" max="200000" @validation="statsErrors.steps = $event">
                            <template #inputLabel>
                                Количество шагов
                            </template>

                            <template #inputError v-if="statsErrors.steps">
                                {{ statsErrors.steps }}
                            </template>
                        </FormInput>
                    </div>
    
                    <div>
                        <FormInput v-model="burnedCalories" id="burnedKcal" name="burnedKcal" type="number" placeholder="Введите количество (в ккал)" min="0" max="10000" @validation="statsErrors.burned_calories = $event">
                            <template #inputLabel>
                                Сожжено калорий
                            </template>

                            <template #inputError v-if="statsErrors.burned_calories">
                                {{ statsErrors.burned_calories }}
                            </template>
                        </FormInput>
                    </div>
    
                    <div>
                        <FormInput v-model="waterMl" id="waterDrinked" name="waterDrinked" type="number" placeholder="Введите количество (в мл)" min="0" max="15000" @validation="statsErrors.water_ml = $event">
                            <template #inputLabel>
                                Выпито воды
                            </template>

                            <template #inputError v-if="statsErrors.water_ml">
                                {{ statsErrors.water_ml }}
                            </template>
                        </FormInput>
                    </div>
    
                    <NextStepBtn>
                        Отправить
                    </NextStepBtn>
                </form>
            </template>
        </DefaultSection>

        <DefaultSection v-if="isTodayStatsExist">
            <template #h2Header>
                Итоги дня
            </template>

            <template #mainContent>
                <div class="dark:text-[#c9cbd0] bg-[#e1e6d9] dark:bg-[#0f172a] p-2 rounded-xl md:p-4">
                    <p class="font-light md:text-xl">Сожжено {{ todayStats?.burned_calories }} ккал</p>
                    <p class="font-light md:text-xl">Пройдено {{ todayStats?.steps }} шагов</p>
                    <p class="font-light md:text-xl">Выпито {{ todayStats?.water_ml }} миллилитров воды</p>
                    <p class="font-bold md:text-xl">Так держать!</p>
                </div>
            </template>
        </DefaultSection>
    </DefaultLayout>
</template>