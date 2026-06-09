<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import FormInput from '@/components/ui/FormInput.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import DefaultLayout from '@/layout/DefaultLayout.vue';
    import { fetchWeightHistory, submitWeight, weightIssueMessage } from '@/api/weightApi';
    import { targetCalories } from '@/services/calories';
    import { loadStats, saveStats, isTodayStatsExist, statsErrors } from '@/api/statsApi';
    import DefaultSection from '@/components/ui/DefaultSection.vue';
    import WeightChart from '@/components/charts/WeightChart.vue';
    import { weights } from '@/api/weightApi';


    const currentWeight = ref('')
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


    onMounted(async () => {
        weights.value = await fetchWeightHistory()
        todayStats.value = await loadStats(selectedDate.value)
    })
</script>

<template>
    <DefaultLayout>
        <section class="flex flex-col gap-3 w-90 md:w-3xl lg:w-5xl">
            <h2 class="text-xl dark:text-[#c9cbd0] text-center font-bold md:text-left md:text-3xl md:w-3xl">Суточная норма калорий для</h2>
            <div class="flex flex-col items-center gap-3">
                <div class="flex items-stretch md:w-3xl lg:w-5xl">
                    <div class="bg-[#419400] flex items-center justify-center px-4 py-8 dark:bg-[#3abdf7] w-30 rounded-l-xl md:flex-1 md:text-xl">
                        <p>Сброса веса</p>
                    </div>
                    <div class="bg-[#f8fdef] w-50 flex flex-col items-center justify-center dark:bg-[#0a1120] rounded-r-xl p-4 transition-colors duration-100 md:p-7 md:py-15 md:flex-1 ">
                        <p class="text-2xl font-semibold dark:text-[#c9cbd0]">{{ targetCalories('fit').toFixed(0) }} ККАЛ</p>
                    </div>
                </div>
    
                <div class="flex items-stretch md:w-3xl lg:w-5xl">
                    <div class="bg-[#419400] flex items-center justify-center px-4 py-8 dark:bg-[#3abdf7] w-30 rounded-l-xl md:flex-1 md:text-xl ">
                        <p>Поддержания веса</p>
                    </div>
                    <div class="bg-[#f8fdef] w-50 flex flex-col items-center justify-center dark:bg-[#0a1120] rounded-r-xl p-4 transition-colors duration-100 md:p-7 md:py-15 md:flex-1 ">
                        <p class="text-2xl font-semibold dark:text-[#c9cbd0]" >{{ targetCalories('weightMaintenance').toFixed(0) }} ККАЛ</p>
                    </div>
                </div>
    
                <div class="flex items-stretch md:w-3xl lg:w-5xl">
                    <div class="bg-[#419400] flex items-center justify-center px-4 py-8 dark:bg-[#3abdf7] w-30 rounded-l-xl md:flex-1 md:text-xl">
                        <p>Набора мышечной массы</p>
                    </div>
                    <div class="bg-[#f8fdef] w-50 flex flex-col items-center justify-center dark:bg-[#0a1120] rounded-r-xl p-4 transition-colors duration-100 md:p-7 md:py-15 md:flex-1">
                        <p class="text-2xl font-semibold dark:text-[#c9cbd0]">{{ targetCalories('bodyBuild').toFixed(0) }} ККАЛ</p>
                    </div>
                </div>
            </div>
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